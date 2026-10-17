import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MyGiftsDto } from './dto/my-gifts.dto';
import { GiftsService } from './gifts.service';

@ApiTags('gifts')
@Controller('gifts')
export class GiftsController {
  constructor(private readonly gifts: GiftsService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'My free plov invitations',
    description:
      'Each paid order gives one; publishing a plov draft uses one instead of paying.',
  })
  mine(@CurrentUser() user: JwtPayload): Promise<MyGiftsDto> {
    return this.gifts.mine(user.sub);
  }
}
