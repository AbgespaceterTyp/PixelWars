package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.msiwar.aview.MainApp.tui
import de.htwg.se.msiwar.aview.MainApp.controller

@Singleton
class WuiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.pixelwars(controller))
  }

  def command(line: String) = Action{
    tui.executeCommand(line)

    Ok(views.html.pixelwars(controller))
  }
}
