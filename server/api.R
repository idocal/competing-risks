source("./main.R")

#* Echo back the input
#* @param msg The message to echo
#* @get /echo
function(msg="") {
  list(msg = paste0("The message is: '", msg, "'"))
}

#* @filter cors
cors <- function(res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    plumber::forward()
}

#* @post /patient
function(age, gender, start_state_type, start_state, states) {
  patient <- get_patient(age = as.numeric(age),
                        gender = as.numeric(gender),
                        start_state_type = as.numeric(start_state_type),
                        start_state = as.numeric(start_state),
                        states = states)
  death_prob <- get_death_prob(patient$all_runs)
  time_at_hospital <- get_time_at_hospital(patient$all_runs)
  time_at_severe <- get_time_at_severe(patient$all_runs)
  hospital_quantiles <- round(get_time_at_hospital_quantiles(patient$all_runs))
  severe_quantiles <- round(get_time_at_severe_quantiles(patient$all_runs))
  print("done!")
  list(death_prob = death_prob,
      hospital = time_at_hospital,
      hospital_quantiles = hospital_quantiles,
      severe = time_at_severe,
      severe_quantiles = severe_quantiles)
}
