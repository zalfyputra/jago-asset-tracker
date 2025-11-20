package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"context"
	"log"
	"net/http"
	"os"
)

type Asset struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	SerialNumber string `json:"serialNumber"`
	Category     string `json:"category"`
	Brand        string `json:"brand"`
	Series       string `json:"series"`
	Screen       string `json:"screen"`
	Processor    string `json:"processor"`
	Memory       string `json:"memory"`
	Storage      string `json:"storage"`
	LastUpdateAt string `json:"lastUpdateAt"`
	CreatedAt    string `json:"createdAt"`
}

var db *pgxpool.Pool

func main() {
	ctx := context.Background()
	var err error
	db, err = pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := gin.Default()

	r.GET("/assets/check", checkAsset)
	r.POST("/assets", createAsset)
	r.PUT("/assets/:id", updateAsset)

	r.Run(":8080")
}

func checkAsset(c *gin.Context) {
	serial := c.Query("serialNumber")
	var a Asset
	err := db.QueryRow(context.Background(),
		`SELECT id, name, serial_number, category, brand, series, screen, processor, memory, storage, last_update_at, created_at
		 FROM assets WHERE serial_number=$1`, serial).
		Scan(&a.ID, &a.Name, &a.SerialNumber, &a.Category, &a.Brand, &a.Series, &a.Screen, &a.Processor, &a.Memory, &a.Storage, &a.LastUpdateAt, &a.CreatedAt)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"registered": false})
		return
	}
	c.JSON(http.StatusOK, gin.H{"registered": true, "asset": a})
}

func createAsset(c *gin.Context) {
	var a Asset
	if err := c.BindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec(context.Background(),
		`INSERT INTO assets (name, serial_number, category, brand, series, screen, processor, memory, storage) 
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		a.Name, a.SerialNumber, a.Category, a.Brand, a.Series, a.Screen, a.Processor, a.Memory, a.Storage)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Asset registered"})
}

func updateAsset(c *gin.Context) {
	id := c.Param("id")
	var a Asset
	if err := c.BindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec(context.Background(),
		`UPDATE assets 
		 SET name=$1, category=$2, brand=$3, series=$4, screen=$5, processor=$6, memory=$7, storage=$8, last_update_at=NOW()
		 WHERE id=$9`,
		a.Name, a.Category, a.Brand, a.Series, a.Screen, a.Processor, a.Memory, a.Storage, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Asset updated"})
}
