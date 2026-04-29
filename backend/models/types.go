package models

import (
	"time"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Username   string `json:"username"`
	Password   string `json:"password"`
	InviteCode string `json:"inviteCode"`
}

type RegisterResponse struct {
	Success  bool   `json:"success"`
	Username string `json:"username"`
}

type Signup struct {
	UserID     string    `json:"userId"`
	Username   string    `json:"username"`
	SignupTime time.Time `json:"signupTime"`
	Position   int       `json:"position"`
	BibWasher  bool      `json:"bibWasher"`
	HasPaid    bool      `json:"hasPaid"`
	PaypalRef  string    `json:"paypalRef"`
}

type SuccessResponse struct {
	Success  bool `json:"success"`
	Position int  `json:"position,omitempty"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type User struct {
	UserID    string    `json:"userId"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"createdAt"`
}

type SignupStatus struct {
	CurrentWeek  string    `json:"currentWeek"`
	CanSignup    bool      `json:"canSignup"`
	MainList     []Signup  `json:"mainList"`
	ReserveList  []Signup  `json:"reserveList"`
	PrevMainList []Signup  `json:"prevMainList"`
	UserSignedUp bool      `json:"userSignedUp"`
	NextReset    time.Time `json:"nextReset"`
}
