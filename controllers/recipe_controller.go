package controllers

import (
	"net/http"
	"recipe-app/database"
	"recipe-app/models"

	"github.com/gin-gonic/gin"
)

func GetRecipes(c *gin.Context) {
  var recipes []models.Recipe
  database.DB.Find(&recipes)
  c.JSON(http.StatusOK, recipes)
}

func CreateRecipe(c *gin.Context) {
  var recipe models.Recipe
  if err := c.ShouldBindJSON(&recipe); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }
  database.DB.Create(&recipe)
  c.JSON(http.StatusCreated, recipe)
}