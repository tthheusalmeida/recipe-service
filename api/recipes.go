package api

import (
	"net/http"
	"recipe-app/database"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/recipes", getRecipes)
}

func getRecipes(c *gin.Context) {
	recipes, err := database.GetRecipes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, recipes)
}
