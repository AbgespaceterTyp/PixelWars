package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.msiwar.aview.MainApp.tui
import de.htwg.se.msiwar.aview.MainApp.controller

@Singleton
class WuiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def index() = Action {
    Ok(views.html.index(controller))
  }
  def about() = Action {
    Ok(views.html.about(controller))
  }
  def control() = Action {
    Ok(views.html.control(controller))
  }
  def command(line: String) = Action{
    tui.executeCommand(line)
    Ok(views.html.pixelwars(controller))
  }

  def backgroundImage() = Action {
    Ok(controller.levelBackgroundImagePath)
  }

  def executeAction(actionId:Int, rowIndex:Int, columnIndex:Int) = Action {
    controller.executeAction(actionId, rowIndex, columnIndex);
    Ok(views.html.pixelwars(controller))
  }
}
