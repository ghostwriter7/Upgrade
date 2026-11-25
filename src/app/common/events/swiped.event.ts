const left = 'left';
const right = 'right';

export class SwipedEvent {

  constructor(public readonly direction: 'left' | 'right') {
  }

  public static left(): SwipedEvent {
    return new SwipedEvent(left);
  }

  public static right(): SwipedEvent {
    return new SwipedEvent(right);
  }
}
