package models

import de.htwg.se.msiwar.model._
import play.api.libs.json._

object JsonConverter {

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