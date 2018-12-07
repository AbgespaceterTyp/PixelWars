package models

import de.htwg.se.msiwar.model._
import play.api.libs.json._

object JsonConverter {
  
  implicit def tuple = new Writes[(Int, Int)] {
    override def writes(o: (Int, Int)) = Json.obj(
      "rowIdx" -> o._1,
      "columnIdx" -> o._2,
    )
  }

  implicit def tuples = new Writes[List[(Int, Int)]] {
    override def writes(o: List[(Int, Int)]): JsValue = {
      JsArray(o.map(Json.toJson(_)))
    }
  }

  implicit def gameObject = new Writes[GameObject] {
    def writes(playerObject: GameObject) = Json.obj(
      "rowIdx" -> playerObject.position.rowIdx,
      "columnIdx" -> playerObject.position.columnIdx,
      "imagePath" -> playerObject.imagePath,
    )
  }

  implicit def gameObjects = new Writes[List[GameObject]] {
    def writes(o: List[GameObject]): JsValue = {
      JsArray(o.map(Json.toJson(_)))
    }
  }
}