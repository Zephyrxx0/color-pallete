import {  Plugin } from "obsidian";
import "assets/add-square.svg";

export default class palette extends Plugin {

  mainCard : HTMLDivElement;
  addButton : HTMLButtonElement;

  onload() {
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";

    this.mainCard = document.body.createDiv("mainCard");
    this.mainCard.setAttr("style", "width: 300px; height: 200px; background-color: white; border: 1px solid black;");
    this.mainCard.setText("Hello, Obsidian!");

    const addButton = this.mainCard.createEl("button", { cls: "add-button" });
    // this.addButton.createSvg();

    // this.mainCard.hide();
  }
}
