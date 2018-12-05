package controllers

import de.htwg.se.msiwar.aview.MainApp.{controller, tui}
import de.htwg.se.msiwar.model.GameObject
import javax.inject._
import models.JsonConverter
import play.api.mvc._
import play.libs.Json

import scala.collection.mutable

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

  def command(line: String) = Action {
    tui.executeCommand(line)
    Ok(views.html.pixelwars(controller))
  }

  def backgroundImage() = Action {
    Ok(controller.levelBackgroundImagePath)
  }

  def executeAction(actionId: Int, rowIndex: Int, columnIndex: Int) = Action {
    controller.executeAction(actionId, rowIndex, columnIndex)
    Ok(views.html.pixelwars(controller))
  }

  def canExecuteAction(actionId: Int, rowIndex: Int, columnIndex: Int) = Action {
    Ok(controller.canExecuteAction(actionId, rowIndex, columnIndex).toString)
  }

  def cellsInRange(actionId: Int) = Action {
    val cells = controller.cellsInRange(Option(actionId))
    Ok(Json.stringify(Json.toJson(cells)))
  }

  def gameBoardToJson() = Action {
    val list = mutable.MutableList[GameObject]()
    for(row <- 0 until controller.rowCount) {
      for(col <- 0 until controller.columnCount) {
        val gameObjectOpt = controller.cellContent(row,col)
        if(gameObjectOpt.isDefined) {
          list += gameObjectOpt.get
        }
      }
    }
    Ok(JsonConverter.gameObjects.writes(list.toList))
  }
}
