source("./main.R")

#* Echo back the input
#* @param msg The message to echo
#* @get /echo
function(msg="") {
  list(msg = paste0("The message is: '", msg, "'"))
}

#* @post /patient
function(age, gender, start_state_type, start_state) {
  patient <- get_patient(age = as.numeric(age),
                        gender = as.numeric(gender),
                        start_state_type = as.numeric(start_state_type),
                        start_state = as.numeric(start_state))
  death_prob <- get_death_prob(patient$all_runs)
  time_at_hospital <- get_time_at_hospital(patient$all_runs)
  time_at_severe <- get_time_at_severe(patient$all_runs)
  print("done!")
  list(death_prob = death_prob,
      hospital = time_at_hospital,
      severe = time_at_severe)
}

#* Plot a histogram
#* @png
#* @get /plot
function() {
  rand <- rnorm(100)
  hist(rand)
}

#* Return the sum of two numbers
#* @param a The first number to add
#* @param b The second number to add
#* @post /sum
function(a, b) {
  as.numeric(a) + as.numeric(b)
}
