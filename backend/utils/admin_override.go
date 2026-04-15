package utils

import "sync"

var (
	signupOverrideMu sync.Mutex
	// nil = no override (use time-based rules), true = forced open, false = forced closed
	signupOverride *bool
)

// SetSignupOverride forces the signup window open (true), closed (false), or removes the override (nil).
func SetSignupOverride(v *bool) {
	signupOverrideMu.Lock()
	defer signupOverrideMu.Unlock()
	signupOverride = v
}

// GetSignupOverride returns the current override: nil = no override, true = open, false = closed.
func GetSignupOverride() *bool {
	signupOverrideMu.Lock()
	defer signupOverrideMu.Unlock()
	return signupOverride
}
