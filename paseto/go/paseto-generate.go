package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"time"

	"github.com/o1egl/paseto"
)

func main() {
	if len(os.Args) != 2 {
		panic(fmt.Sprintf("Usage: %v <base64 encoded 32 byte paseto key>", os.Args[0]))
	}
	encodedKey := os.Args[1]
	decodedKey, err := base64.StdEncoding.DecodeString(encodedKey)
	if err != nil {
		panic(err)
	}
	if len(decodedKey) != 32 {
		panic(fmt.Sprintf("Length of the base64 decoded PASETO_KEY is %v, not 32", len(decodedKey)))
	}

	now := time.Now()
	exp := now.Add(24 * time.Hour)
	nbt := now

	jsonToken := paseto.JSONToken{
		// Audience:   "test",
		// Issuer:     "test_service",
		// Jti:        "123",
		// Subject:    "test_subject",
		IssuedAt:   now,
		Expiration: exp,
		NotBefore:  nbt,
	}
	// Add custom claim    to the token
	// jsonToken.Set("data", "this is a signed message")
	// footer := "some footer"
	footer := ""

	// Encrypt data
	token, err := paseto.NewV2().Encrypt(decodedKey, jsonToken, footer)
	if err != nil {
		panic(err)
	}
	fmt.Println(token)

	// Decrypt data
	var newJsonToken paseto.JSONToken
	var newFooter string
	err = paseto.NewV2().Decrypt(token, decodedKey, &newJsonToken, &newFooter)
	if err != nil {
		panic(err)
	}
}
