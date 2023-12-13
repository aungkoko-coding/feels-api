import { Controller, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import * as Ably from 'ably';

@Controller('ably')
export class AblyController {
  @Get('auth')
  assignToken(@Res() res: Response) {
    const rest = new Ably.Rest(process.env.ABLY_API_KEY!);
    const tokenParams = {
      clientId: 'my-client-id',
    };
    rest.auth.createTokenRequest(tokenParams, null, (err, tokenRequest) => {
      if (err) {
        res.status(500).send('Error requesting token: ' + JSON.stringify(err));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tokenRequest));
      }
    });
  }
}
