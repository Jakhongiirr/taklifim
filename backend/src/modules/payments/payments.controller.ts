import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { CheckoutDto, CheckoutResultDto } from './dto/checkout.dto';
import { ListOrdersQueryDto } from './dto/list-orders-query.dto';
import { AdminOrderPageDto } from './dto/order.dto';
import { PaymentsService } from './payments.service';
import { PaymeService } from './payme.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly payme: PaymeService,
  ) {}

  @Post('checkout/:taklifId')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: "Start paying for the owner's draft",
    description:
      "Returns Payme's checkout URL for an order at the design's current price. A free design is published at once (published: true, no url).",
  })
  @ApiNotFoundResponse({ description: 'Not your invitation' })
  @ApiConflictResponse({ description: 'Already paid, or not a draft' })
  @ApiServiceUnavailableResponse({ description: 'Payme is not configured' })
  checkout(
    @Param('taklifId', ParseUUIDPipe) taklifId: string,
    @Body() dto: CheckoutDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<CheckoutResultDto> {
    return this.payments.checkout(taklifId, dto, user);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Orders and their Payme status (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  list(@Query() query: ListOrdersQueryDto): Promise<AdminOrderPageDto> {
    return this.payments.list(query);
  }

  /**
   * Payme's Merchant API endpoint (JSON-RPC). Always HTTP 200 with a raw
   * JSON-RPC body, so it bypasses the usual `{ success, data }` wrapper;
   * Payme authenticates with Basic auth, not a user token.
   */
  @Post('payme')
  @Public()
  @SkipThrottle()
  @ApiExcludeEndpoint()
  async paymeRpc(@Req() req: Request, @Res() res: Response) {
    const result = await this.payme.handle(req.body, req.headers.authorization);
    res.status(200).json(result);
  }
}
