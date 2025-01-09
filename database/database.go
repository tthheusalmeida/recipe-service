package database

import (
	"database/sql"
	"log"
	"os"

	"recipe-app/models"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() error {
    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        log.Fatal("DATABASE_URL is not set")
    }

    var err error
    DB, err = sql.Open("postgres", dsn)
    if err != nil {
        return err
    }

    if err = DB.Ping(); err != nil {
        return err
    }

    log.Println("Database connected!")
    return nil
}

// GetRecipes retorna todas as receitas do banco de dados
func GetRecipes() ([]models.Recipe, error) {
    rows, err := DB.Query("SELECT id, title, description FROM recipes")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var recipes []models.Recipe
    for rows.Next() {
        var recipe models.Recipe
        if err := rows.Scan(&recipe.ID, &recipe.Title, &recipe.Description); err != nil {
            return nil, err
        }
        recipes = append(recipes, recipe)
    }

    return recipes, nil
}
