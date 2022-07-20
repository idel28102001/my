import { Wizard } from 'nestjs-telegraf';

@Wizard('sign-up-for-admin')
export class SignUpForAdminWizard {
  // constructor(
  //   private readonly usersService: UsersService,
  //   private readonly signupsService: SignupsService,
  //   private readonly telegramSerivce: TelegramService,
  // ) {}
  //
  // async deleteMessage(ctx) {
  //   try {
  //     await ctx.deleteMessage();
  //     await ctx.deleteMessage();
  //   } catch (e) {}
  // }
  //
  // @WizardStep(1)
  // async step1(@Context() ctx: Scenes.WizardContext) {
  //   const cntx = ctx as any;
  //   const data = cntx.update.callback_query?.data;
  //   if (data) {
  //     await this.deleteMessage(ctx);
  //     const days = getNDays(7, addDays(new Date(), 1));
  //     (ctx as any).session.type = data;
  //     await ctx.reply('Выберите день', {
  //       reply_markup: {
  //         keyboard: days,
  //         resize_keyboard: true,
  //         one_time_keyboard: true,
  //       },
  //     });
  //     ctx.wizard.next();
  //     return;
  //   }
  //   await ctx.reply('Выберите - что будете ставить', {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: 'Консультация',
  //             callback_data: SignupsEnum.CONSULTATION,
  //           },
  //           { text: 'Диагностика', callback_data: SignupsEnum.DIAGNOSTIC },
  //         ],
  //       ],
  //     },
  //   });
  // }
  //
  // @WizardStep(2)
  // async step2(ctx: Scenes.WizardContext) {
  //   const cntx = ctx as any;
  //   const text = cntx.update.message.text;
  //   if (text.startsWith('/')) {
  //     ctx.scene.leave();
  //     return;
  //   }
  //   const date = getDateFromDays(text, new Date());
  //   const etc = await this.signupsService.findByDate(addHours(date, 0));
  //   (ctx as any).session.etc = etc;
  //   (ctx as any).session.date = text;
  //   (ctx as any).session.wholeDate = addHours(date, 6);
  //   const times = getTimes(cntx.session.type, [], etc);
  //   const keyboard = createKeyboard(times);
  //   await ctx.reply('Выбирайте время', {
  //     reply_markup: {
  //       keyboard: [...keyboard, [{ text: 'Закончить' }]],
  //       one_time_keyboard: true,
  //       resize_keyboard: true,
  //     },
  //   });
  //   await ctx.wizard.next();
  // }
  //
  // @WizardStep(3)
  // async step3(ctx: Scenes.WizardContext) {
  //   const cntx = ctx as any;
  //   const times = (ctx as any).session.times || [];
  //   const data = cntx.update.callback_query?.data;
  //   if (data) {
  //     const message = cntx.update.callback_query.message.text
  //       .split('\n\n')
  //       .slice(0, -1);
  //     try {
  //       await ctx.editMessageText(message.join('\n'), { reply_markup: null });
  //     } catch (e) {}
  //     let days;
  //     switch (data) {
  //       case 'yes': {
  //         const { dates, messageId } = await this.signupsService.uploadTimes(
  //           times,
  //           getMainDate((ctx as any).session.wholeDate),
  //           (ctx as any).session.type,
  //         );
  //         await this.telegramSerivce.sendMessageToChannel(
  //           dates,
  //           (ctx as any).session.date,
  //           messageId,
  //         );
  //         await ctx.reply('Вы успешно внесли данные!');
  //         break;
  //       }
  //       case 'no': {
  //         await ctx.reply('Создание отменено');
  //         break;
  //       }
  //     }
  //     (ctx as any).session = {};
  //     ctx.scene.leave();
  //     return;
  //   }
  //   const text = cntx.update.message.text;
  //   if (text.startsWith('/')) {
  //     ctx.scene.leave();
  //     return;
  //   }
  //   switch (text) {
  //     case 'Закончить': {
  //       const type =
  //         cntx.session.type === SignupsEnum.CONSULTATION
  //           ? 'Консультация'
  //           : 'Диагностика';
  //       await ctx.reply(
  //         `Тип: ${type}\nДата: ${cntx.session.date}\nВремя:\n${orderTimes(
  //           times,
  //         ).join('\n')}\n\nВы подтверждаете?`,
  //         {
  //           reply_markup: {
  //             inline_keyboard: [
  //               [
  //                 {
  //                   text: 'Да',
  //                   callback_data: 'yes',
  //                 },
  //                 { text: 'Нет', callback_data: 'no' },
  //               ],
  //             ],
  //           },
  //         },
  //       );
  //       break;
  //     }
  //     default: {
  //       times.push(text);
  //       (ctx as any).session.times = times;
  //       const timess = getTimes(
  //         cntx.session.type,
  //         times,
  //         (ctx as any).session.etc,
  //       );
  //       const keyboard = createKeyboard(timess);
  //       await ctx.reply('Выбирайте время', {
  //         reply_markup: {
  //           keyboard: [...keyboard, [{ text: 'Закончить' }]],
  //           resize_keyboard: true,
  //           one_time_keyboard: true,
  //         },
  //       });
  //       await ctx.wizard.selectStep(2);
  //       break;
  //     }
  //   }
  // }
}
