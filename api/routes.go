package api

import (
	"recipe-app/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
  recipeRoutes := r.Group("/recipes")
  {
    recipeRoutes.GET("/", controllers.GetRecipes)
    recipeRoutes.POST("/", controllers.CreateRecipe)
  }
}