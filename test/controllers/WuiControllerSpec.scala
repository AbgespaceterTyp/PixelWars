package controllers

import java.util.UUID

import com.google.inject.AbstractModule
import com.mohiva.play.silhouette.api.{Environment, LoginInfo}
import com.mohiva.play.silhouette.test._
import models.User
import net.codingwell.scalaguice.ScalaModule
import org.specs2.mock.Mockito
import org.specs2.specification.Scope
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.CSRFTokenHelper.addCSRFToken
import play.api.test.{FakeRequest, PlaySpecification, WithApplication}
import utils.auth.DefaultEnv

import scala.concurrent.ExecutionContext.Implicits.global
import scala.io.Source

class WuiControllerSpec extends PlaySpecification with Mockito {
  sequential

  // General Pages
  "Index action" should {
    "be shown if user is authorized" in new Context {
      new WithApplication(application) {
        val Some(result) = route(app, addCSRFToken(FakeRequest(routes.WuiController.index()).withAuthenticator[DefaultEnv](identity.loginInfo)))

        status(result) must beEqualTo(OK)
        contentType(result) must beSome("text/html")
        contentAsString(result) must contain("Welcome to PixelWars!")
      }
    }

    "redirect to login page if user is unauthorized" in new Context {
      new WithApplication(application) {
        val Some(redirectResult) = route(app, FakeRequest(routes.WuiController.index())
          .withAuthenticator[DefaultEnv](LoginInfo("invalid", "invalid"))
        )

        status(redirectResult) must be equalTo SEE_OTHER

        val redirectURL = redirectLocation(redirectResult).getOrElse("")
        redirectURL must contain(routes.SignInController.view().toString)

        val Some(unauthorizedResult) = route(app, addCSRFToken(FakeRequest(GET, redirectURL)))

        status(unauthorizedResult) must be equalTo OK
        contentType(unauthorizedResult) must beSome("text/html")
        contentAsString(unauthorizedResult) must contain("Sign in")
      }
    }
  }

  "about action" should {
    "be shown if user is authorized" in new Context {
      new WithApplication(application) {
        val Some(result) = route(app, addCSRFToken(FakeRequest(routes.WuiController.about()).withAuthenticator[DefaultEnv](identity.loginInfo)))

        status(result) must beEqualTo(OK)
        contentType(result) must beSome("text/html")
        contentAsString(result) must contain("(Creator) Lukas Groß und Samantha Isted")
      }
    }

    "redirect to login page if user is unauthorized" in new Context {
      new WithApplication(application) {
        val Some(redirectResult) = route(app, FakeRequest(routes.WuiController.about())
          .withAuthenticator[DefaultEnv](LoginInfo("invalid", "invalid"))
        )

        status(redirectResult) must be equalTo SEE_OTHER

        val redirectURL = redirectLocation(redirectResult).getOrElse("")
        redirectURL must contain(routes.SignInController.view().toString)

        val Some(unauthorizedResult) = route(app, addCSRFToken(FakeRequest(GET, redirectURL)))

        status(unauthorizedResult) must be equalTo OK
        contentType(unauthorizedResult) must beSome("text/html")
        contentAsString(unauthorizedResult) must contain("Sign in")
      }
    }
  }

  "gameSelection action" should {
    "be shown if user is authorized" in new Context {
      new WithApplication(application) {
        val Some(result) = route(app, addCSRFToken(FakeRequest(routes.WuiController.gameSelection()).withAuthenticator[DefaultEnv](identity.loginInfo)))

        status(result) must beEqualTo(OK)
        contentType(result) must beSome("text/html")
        contentAsString(result) must contain("Select your mission!")
      }
    }

    "redirect to login page if user is unauthorized" in new Context {
      new WithApplication(application) {
        val Some(redirectResult) = route(app, FakeRequest(routes.WuiController.gameSelection())
          .withAuthenticator[DefaultEnv](LoginInfo("invalid", "invalid"))
        )

        status(redirectResult) must be equalTo SEE_OTHER

        val redirectURL = redirectLocation(redirectResult).getOrElse("")
        redirectURL must contain(routes.SignInController.view().toString)

        val Some(unauthorizedResult) = route(app, addCSRFToken(FakeRequest(GET, redirectURL)))

        status(unauthorizedResult) must be equalTo OK
        contentType(unauthorizedResult) must beSome("text/html")
        contentAsString(unauthorizedResult) must contain("Sign in")
      }
    }

    "control action" should {
      "be shown if user is authorized" in new Context {
        new WithApplication(application) {
          val Some(result) = route(app, addCSRFToken(FakeRequest(routes.WuiController.control()).withAuthenticator[DefaultEnv](identity.loginInfo)))

          status(result) must beEqualTo(OK)
          contentType(result) must beSome("text/html")
          contentAsString(result) must contain("Zeigt die möglichen Aktionen des aktuellen Spielers an")
        }
      }

      "redirect to login page if user is unauthorized" in new Context {
        new WithApplication(application) {
          val Some(redirectResult) = route(app, FakeRequest(routes.WuiController.control())
            .withAuthenticator[DefaultEnv](LoginInfo("invalid", "invalid"))
          )

          status(redirectResult) must be equalTo SEE_OTHER

          val redirectURL = redirectLocation(redirectResult).getOrElse("")
          redirectURL must contain(routes.SignInController.view().toString)

          val Some(unauthorizedResult) = route(app, addCSRFToken(FakeRequest(GET, redirectURL)))

          status(unauthorizedResult) must be equalTo OK
          contentType(unauthorizedResult) must beSome("text/html")
          contentAsString(unauthorizedResult) must contain("Sign in")
        }
      }
    }

    // TUI
    "command action" should {
      "start scenario 1 when user is authorized" in new Context {
        new WithApplication(application) {
          val Some(result) = route(app, addCSRFToken(FakeRequest(routes.WuiController.command("n1")).withAuthenticator[DefaultEnv](identity.loginInfo)))

          status(result) must beEqualTo(OK)
          contentType(result) must beSome("text/html")

          val testFile = Source.fromFile("test/resources/scenario1.txt")
          contentAsString(result) must contain(testFile.mkString)
          testFile.close()
        }
      }

      "redirect to login page if user is unauthorized" in new Context {
        new WithApplication(application) {
          val Some(redirectResult) = route(app, FakeRequest(routes.WuiController.command("n1"))
            .withAuthenticator[DefaultEnv](LoginInfo("invalid", "invalid"))
          )

          status(redirectResult) must be equalTo SEE_OTHER

          val redirectURL = redirectLocation(redirectResult).getOrElse("")
          redirectURL must contain(routes.SignInController.view().toString)

          val Some(unauthorizedResult) = route(app, addCSRFToken(FakeRequest(GET, redirectURL)))

          status(unauthorizedResult) must be equalTo OK
          contentType(unauthorizedResult) must beSome("text/html")
          contentAsString(unauthorizedResult) must contain("Sign in")
        }
      }
    }
  }

  trait Context extends Scope {

    class FakeModule extends AbstractModule with ScalaModule {
      def configure() = {
        bind[Environment[DefaultEnv]].toInstance(env)
      }
    }

    val identity = User(
      userID = UUID.randomUUID(),
      loginInfo = LoginInfo("google", "tester@gmail.com"),
      firstName = None,
      lastName = None,
      fullName = None,
      email = None,
      avatarURL = None,
      activated = true
    )

    implicit val env: Environment[DefaultEnv] = new FakeEnvironment[DefaultEnv](Seq(identity.loginInfo -> identity))

    lazy val application = new GuiceApplicationBuilder()
      .overrides(new FakeModule)
      .build()
  }

}
