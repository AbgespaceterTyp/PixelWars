package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.msiwar.aview.MainApp.tui

@Singleton
class WuiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def command(line: String) = Action{
    tui.executeCommand(line)
  }
}
