import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {

  @Get()
  root(@Res() res: Response) {
    return res.render('index');
  }

  @Get('/signup')
  signup(@Res() res: Response) {
    return res.render('signup');
  }

  @Get('/signin')
  signin(@Res() res: Response) {
    return res.render('signin');
  }

  @Get('/offeree')
  offereeHomePage(@Res() res: Response) {
    return res.render('homepage');
  }
}
