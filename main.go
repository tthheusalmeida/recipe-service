package main

import (
	"recipe-app/api"
	"recipe-app/database"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()
	api.SetupRoutes(r)

	r.Run(":8080")
}