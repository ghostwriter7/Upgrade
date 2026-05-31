import { TestBed } from '@angular/core/testing';
import { CommandBus } from '@common/routers/command/command-bus';
import { COMMAND_HANDLERS } from '@common/routers/command/command-handlers.token';
import { CreateSessionCommand } from '@session/commands/create-session/create-session-command';
import { DeleteSessionCommand } from '@session/commands/delete-session/delete-session-command';
import { Session } from '@domain/model/session/session.model';
import { UpdateSetCommand } from '@session/commands/update-set/update-set.command';
import { BodyweightSet } from '@domain/model/exercise-set.model';
import { Command } from '@common/routers/command/command';

class UnknownCommand extends Command {
  constructor() {
    super();
  }
}

describe('CommandBus', () => {
  const [handlerA, handlerB, handlerC] = [
    CreateSessionCommand,
    DeleteSessionCommand,
    UpdateSetCommand,
  ].map((constructor) => ({ appliesTo: () => constructor, handle: vi.fn() }));

  let bus: CommandBus;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        CommandBus,
        { provide: COMMAND_HANDLERS, multi: true, useValue: handlerA },
        { provide: COMMAND_HANDLERS, multi: true, useValue: handlerB },
        { provide: COMMAND_HANDLERS, multi: true, useValue: handlerC },
      ],
    });

    bus = TestBed.inject(CommandBus);
  });

  test.each([
    { command: new CreateSessionCommand(), expectedHandler: handlerA },
    { command: new DeleteSessionCommand(Session.createEmpty()), expectedHandler: handlerB },
    {
      command: new UpdateSetCommand(new BodyweightSet('sessionId', 'exerciseId', 0, 1)),
      expectedHandler: handlerC,
    },
  ])('should dispatch a command to the right handler', ({ command, expectedHandler }) => {
    bus.dispatch(command);

    expect(expectedHandler.handle).toHaveBeenCalledExactlyOnceWith(command);
  });

  it('should throw an error when no handler is found for the command', () => {
    const command = new UnknownCommand();

    expect(() => bus.dispatch(command)).toThrow('No handler found for command: UnknownCommand');
  });
});
