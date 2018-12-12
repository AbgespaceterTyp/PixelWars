package controllers

import akka.actor.ActorSystem
import akka.stream.Materializer
import de.htwg.se.msiwar.aview.MainApp.{controller, tui}
import javax.inject._
import play.api.libs.streams.ActorFlow
import play.api.mvc._
import socket.WebSocketActor
import utils.JsonConverter

@Singleton
class WuiController @Inject()(implicit system: ActorSystem, materializer: Materializer, cc: ControllerComponents) extends AbstractController(cc) {

  def index() = Action {
    Ok(views.html.index(controller))
  }

  def about() = Action {
    Ok(views.html.about(controller))
  }

  def gameSelection() = Action {
    Ok(views.html.gameSelection(controller))
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
    Ok(JsonConverter.tuples.writes(cells))
  }

  def gameBoardToJson() = Action {
    Ok(JsonConverter.gameBoardToJson())
  }

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef(out => WebSocketActor.props(out))
  }
}
