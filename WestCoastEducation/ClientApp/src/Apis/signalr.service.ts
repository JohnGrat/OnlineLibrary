import {
  LogLevel,
  HubConnection,
  HubConnectionState,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import { CommentDto } from "../Models/comment";
const baseUrl = import.meta.env.DEV ? import.meta.env.VITE_BASE_URL : "/api";

class SignalRService {
  private static _signalRService: SignalRService;
  private _hubConnection: HubConnection | undefined;

  private constructor() {
    this.createConnection();
  }

  public static get Instance(): SignalRService {
    return this._signalRService || (this._signalRService = new this());
  }

  get connectionState(): HubConnectionState {
    return this._hubConnection?.state ?? HubConnectionState.Disconnected;
  }

  public async startConnection(): Promise<void> {
    console.log(this.connectionState)
    await this._hubConnection?.start();
  }

  public async disconnect(): Promise<void> {
    await this._hubConnection?.stop();
  }

  private createConnection(): void {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/commenthub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  public async subscribeToComments(bookId: string): Promise<void> {
    this._hubConnection?.invoke("SubscribeToComments", bookId);
  }

  public async unsubscribeFromComments(bookId: string): Promise<void> {
    this._hubConnection?.invoke("UnsubscribeFromComments", bookId);
  }

  public async onCommentAdded(
    callback: (comment: CommentDto) => void
  ): Promise<void> {
    this._hubConnection?.on("CommentAdded", callback);
  }

  public async newCommentAdded(comment: any): Promise<void> {
    this._hubConnection?.invoke("NewCommentAdded", comment);
  }

  public async getCommentsForBook(bookId: string): Promise<CommentDto[]> {
    try {
      const comments = await this._hubConnection?.invoke(
        "GetCommentsForBook",
        bookId
      );
      return comments;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export const SignalRApi = SignalRService.Instance;
