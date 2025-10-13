import { SceneGame } from "./sceneGame";

// *************************************************
// タイトルシーン
// *************************************************
export class SceneTitle extends g.Scene {
	constructor(param: g.GameMainParameterObject) {
		super({ game: g.game });
		// 読込時処理
		this.onLoad.add(() => {
			this._Load(param);
		});
	}

	private _Load(param: g.GameMainParameterObject): void {
		// フォント
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 48,
		});
		// ラベル
		new g.Label({
			scene: this,
			text: "ピンボールタイトル",
			font: font,
			textColor: "black",
			anchorX: 0.5, anchorY: 0.5,
			x: g.game.width / 2, y: g.game.height / 2,
			touchable: true,
			parent: this,
		}).onPointDown.add(() => {
			// 画面タッチでゲームシーンへ
			g.game.pushScene(new SceneGame(param));
		});
		return;
	}
}
