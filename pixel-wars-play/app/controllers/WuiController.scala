package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.msiwar.aview.MainApp.tui
import de.htwg.se.msiwar.aview.MainApp.controller

@Singleton
class WuiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  /**
    * Create an Action to render an HTML page.
    *
    * The configuration in the `routes` file means that this method
    * will be called when the application receives a `GET` request with
    * a path of `/`.
    */
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.pixelwars())
  }

  def command(line: String) = Action{
    tui.executeCommand(line)

    val result = StringBuilder.newBuilder
    for (i <- 0 until controller.rowCount) {
      result.append("| ")
      for (j <- 0 until controller.columnCount) {
        result.append(controller.cellContentToText(i, j) + " | ")
      }
      result.append("\n")
    }
    Ok(result.toString())
  }
}
