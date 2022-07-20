import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { UsersService } from 'src/users/services/users.service';
import { Scenes } from 'telegraf';
import { RolesEnum } from '../../users/enums/roles.enum';

@Wizard('make-me-admin')
export class MakeMeAdminWizard {
  constructor(private readonly usersService: UsersService) {}

  async deleteMessage(ctx) {
    try {
      await ctx.deleteMessage();
      await ctx.deleteMessage();
    } catch (e) {}
  }

  @WizardStep(1)
  async step1(@Context() ctx: Scenes.WizardContext) {
    const cntx = ctx as any;
    const { id } = cntx.update.message.from;
    const user = await this.usersService.findByTelegramId(id.toString(), {
      select: ['role'],
    });
    if (!user) {
      await ctx.reply(
        'Ошибка. Попробуйте ещё раз или отправьте /start для добавления вас в базу',
      );
      await ctx.scene.leave();
    }
    switch (user.role) {
      case RolesEnum.USER: {
        await ctx.reply(
          'Если вы хотите стать админом - введите код админа. Если хотите выйти - отправьте /exit',
        );
        await ctx.wizard.next();
        break;
      }
      case RolesEnum.ADMIN: {
        await ctx.reply('Вы уже являетесь админом');
        await ctx.scene.leave();
        break;
      }
    }
  }

  @WizardStep(2)
  async step2(@Context() ctx: Scenes.WizardContext) {
    const cntx = ctx as any;
    const { id } = cntx.update.message.from;
    const text = cntx.update.message.text;
    switch (text) {
      case '/exit': {
        await ctx.scene.leave();
        break;
      }
      default: {
        if (text === process.env.ADMIN_SECRET) {
          const user = await this.usersService.findByTelegramId(id.toString(), {
            select: ['id', 'role'],
          });
          user.role = RolesEnum.ADMIN;
          await this.usersService.save(user);
          await ctx.reply('Теперь ваш статус - админ');
        } else {
          await ctx.reply('Код неверен');
        }
        await ctx.scene.leave();
      }
    }
  }
}
