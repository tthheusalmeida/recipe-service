package models

type Recipe struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Title       string `json:"title"`
	Ingredients string `json:"ingredients"`
	Steps       string `json:"steps"`
}