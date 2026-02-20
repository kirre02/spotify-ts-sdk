import { Context, type Effect } from "effect";

export class AuthService extends Context.Tag("AuthService")<
	AuthService,
	{
		getToken: Effect.Effect<string>;
	}
>() {}
