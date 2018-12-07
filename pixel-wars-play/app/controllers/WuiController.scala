package controllers

import akka.actor.ActorSystem
import akka.stream.Materializer
import de.htwg.se.msiwar.aview.MainApp.{controller, tui}
import javax.inject._
import play.api.libs.streams.ActorFlow
import play.api.mvc._
import socket.WebSocketActor
import utils.JsonConverter

import scala.concurrent.Future

@Singleton
class WuiController @Inject()(implicit system: ActorSystem, materializer: Materializer, cc: ControllerComponents) extends AbstractController(cc) {

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
    Ok(JsonConverter.tuples.writes(cells))
  }

  def gameBoardToJson() = Action {
    Ok(JsonConverter.gameBoardToJson())
  }

  def socket = WebSocket.acceptOrResult[String, String] { request =>
    Future.successful(request.contentType match {
      case None => Left(Forbidden)
      case Some("application/json") => Right(ActorFlow.actorRef(out => WebSocketActor.props(out)))
    })
  }
}
