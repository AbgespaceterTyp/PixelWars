package controllers

import akka.actor.ActorSystem
import akka.stream.Materializer
import com.mohiva.play.silhouette.api.Silhouette
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import de.htwg.se.msiwar.aview.MainApp.{ controller, tui }
import javax.inject._
import org.webjars.play.WebJarsUtil
import play.api.i18n.I18nSupport
import play.api.libs.streams.ActorFlow
import play.api.mvc._
import socket.WebSocketActor
import utils.JsonConverter
import utils.auth.DefaultEnv

import scala.concurrent.Future

@Singleton
class WuiController @Inject() (implicit webJarsUtil: WebJarsUtil, system: ActorSystem, assets: AssetsFinder, materializer: Materializer, cc: ControllerComponents, silhouette: Silhouette[DefaultEnv]) extends AbstractController(cc) with I18nSupport {

  def index() = silhouette.UnsecuredAction { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def about() = silhouette.UnsecuredAction { implicit request: Request[AnyContent] =>
    Ok(views.html.about())
  }

  def gameSelection() = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(views.html.gameSelection(controller)))
  }

  def control() = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(views.html.control()))
  }

  def command(line: String) = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    tui.executeCommand(line)
    Future.successful(Ok(views.html.pixelwars(controller)))
  }

  def backgroundImage() = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(controller.levelBackgroundImagePath))
  }

  def executeAction(actionId: Int, rowIndex: Int, columnIndex: Int) = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    controller.executeAction(actionId, rowIndex, columnIndex)
    Future.successful(Ok(JsonConverter.playerStatusToJson()))
  }

  def canExecuteAction(actionId: Int, rowIndex: Int, columnIndex: Int) = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(controller.canExecuteAction(actionId, rowIndex, columnIndex).toString))
  }

  def cellsInRange(actionId: Int) = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    val cells = controller.cellsInRange(Option(actionId))
    Future.successful(Ok(JsonConverter.tuples.writes(cells)))
  }

  def gameBoard() = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(JsonConverter.gameBoardToJson()))
  }

  def actions() = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(JsonConverter.actionsForPlayerToJson(controller.activePlayerNumber)))
  }

  def socket = WebSocket.accept[String, String] { _ =>
    ActorFlow.actorRef(out => WebSocketActor.props(out))
  }
}
