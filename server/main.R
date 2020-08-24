source("utils.R")
source("model/multi_state_competing_risks_model.R")
library(ROCit)
library(ModelMetrics)
library(ggplot2)
library(parallel)
library(tictoc)

### Load Data & Set Constants
params <- list(seed=500, cores=10)
set.seed(params$seed)

#Setting variables
global_start <- "2020-03-01"
global_censor <- as.Date("2020-05-03") - 1
N_MONTE_CARLO_RUNS <- 20000
MAX_PATH_LENGTH <- 10
covariate_names <- get_corona_model_covariate_names()
dataset <- construct_multi_state_model_dataset()

#Filter illegal data or outlier data
fix_last_transition <- function(obj) {
    end_point <- as.Date(obj$date_of_hospitalization) + sum(obj$time_at_each_state)
    if (end_point < global_censor) {
        if ((as.Date(obj$date_of_hospitalization) < as.Date(global_start)) || (length(obj$time_at_each_state) < length(obj$states) || ((as.Date(obj$date_of_hospitalization) + sum(obj$time_at_each_state) < global_censor))) && !tail(obj$states, n=1) %in% c(TERMINAL_STATES,RECOVERED_OR_OOHQ)) {
            return(NULL)
        }
    }
    n_states <- length(obj$states)
    if (n_states > 1) {
        for (i in 1:(n_states - 1)) {
            ins <- obj$states[i]
            outs <- obj$states[i + 1]
            for (bts in BAD_TRANSITIONS) {
                if ((ins == bts[1]) && (outs == bts[2])) {
                    return(NULL)
                }
            }
        }
    }
    return(obj)
}
dataset <- sapply(dataset, function(obj) fix_last_transition(obj))
dataset <- Filter(dataset, f = function(x) !is.null(x))

# Helper functions
construct_cov <- function(age, sex, enter_state) {
    type <- enter_state
    return(c(age, sex, type == 3, type == 4, 0, 0, age * sex, 
            age * (type == 3),
            age * (type == 4), 0, 0))
}

get_sample_cov_at_end <- function(samp) {
    states <- samp$states
    nstates <- length(states)
    ret <- samp$covariates_at_T
    if (nstates < 2) {
        return(ret)
    } 
    for (i in 1:(nstates-1)) {
        org <- states[i]
        dst <- states[i+1]
        ret <- update_covariates(ret, org,dst, samp$time_at_each_state[i])
    }
    return(ret)
}


#Fitting model
model <- MultiStateModel()
model$fit(dataset = dataset,
          terminal_states = TERMINAL_STATES, 
          update_covariates_function = update_covariates, 
          covariate_names = covariate_names)

print('---------------------------------------------------------')
model$state_specific_models[[MILD_OR_MODERATE]]$event_specific_models[[DECEASED]] = 
  get_modified_mild_or_moderate_to_deceased_cox_model(model, 
                                                      dataset, 
                                                      TERMINAL_STATES, 
                                                      update_covariates)

print('---------------------------------------------------------')
model$state_specific_models[[RECOVERED_OR_OOHQ]]$event_specific_models[[MILD_OR_MODERATE]] =
get_modified_recovered_or_oohq_to_mild_or_moderate_cox_model(model,
dataset = dataset,
TERMINAL_STATES,
update_covariates)

get_patient <- function(age, gender, start_state_type, start_state, states) {
    print("simulating patient...")
    covariates <- construct_cov(age, gender, start_state_type)
    if (length(states)) {
        medical_states <- c(states$medicalState)
        times <- c(states$hospital)
        print(times)
        print(medical_states)
        # times <- c(10, 5)
        # medical_states <- c(MILD_OR_MODERATE, SEVERE)
        patient <- list(covariates_at_T = covariates, state_at_T = start_state, 
                        states = medical_states, time_at_each_state = times)
        patient$covariates_at_T <- get_sample_cov_at_end(patient)
        time_in_hospital <- sum(patient$time_at_each_state)
        origin_state <- tail(patient$states, 1)
    }

    else {
        patient <- list(covariates_at_T = covariates, state_at_T = start_state)
        time_in_hospital <- 0
        origin_state <- patient$state_at_T
    }
    set.seed(params$seed)
    patient$all_runs <- model$run_monte_carlo_simulation(
                                patient$covariates_at_T,
                                origin_state = origin_state,
                                current_time = time_in_hospital,
                                n_random_samples = N_MONTE_CARLO_RUNS,
                                max_transitions = MAX_PATH_LENGTH)
    print("returned patient!")
    patient
}

# Path calculations
count_paths <- function(all_runs) {
    paths <- lapply(all_runs, function(run) paste(run$states, collapse = " "))
    path_counts <- data.frame(table(unlist(paths)))
    colnames(path_counts) <- c("path", "# of runs")
    return(path_counts)
}

death_path <- function(path) {
    death_ind <- 0
    L <- length(path)
    if (path[L] == "5") death_ind <- 1
    return(death_ind)
}

death_rate <- function(all_runs) {
    paths <- lapply(all_runs, function(run) death_path((run$states)))
    return(mean(unlist(paths)))
}

time_at_hospital <- function(run) {
  states <- run$states
  time_at_each_state <- run$time_at_each_state
  if (length(states) > length(time_at_each_state)) {
    states <- head(states, -1)
  }
  return(sum(time_at_each_state[states != RECOVERED_OR_OOHQ]))
}

time_at_severe <- function(run) {
  states <- run$states
  time_at_each_state <- run$time_at_each_state
  if (length(states) > length(time_at_each_state)) {
    states <- head(states, -1)
  }
  return(sum(time_at_each_state[states == SEVERE]))
}

# Calculate statistics
get_death_prob <- function(all_runs) {
    print("calculating death probability...")
    death_rate(all_runs)
}

get_severe_prob <- function(all_runs) {
    print("calculating entering severe probability...")
    times <- as.numeric(lapply(all_runs, function(run) time_at_severe(run)))
    mean(times > 0)
}

get_time_at_hospital <- function(all_runs) {
    print("calculating time at hospital...")
    times <- c(as.numeric(lapply(all_runs, function(run) time_at_hospital(run))))
    times_matrix <- data.frame(times)
    graph <- ggplot(times_matrix, aes(round(times))) + stat_ecdf()
    graph.data <- layer_data(graph)
    ret <- list()
    ret$x <- graph.data$x
    ret$y <- graph.data$y
    ret
    # round(quantile(times, probs = c(0.1, 0.25, 0.5, 0.75, 0.9)))
}

get_time_at_hospital_quantiles <- function(all_runs) {
    print("calculating time at hospital quantiles...")
    times <- c(as.numeric(lapply(all_runs, function(run) time_at_hospital(run))))
    quantile(times, probs = c(0.1, 0.25, 0.5, 0.75, 0.9))
}

get_time_at_severe <- function(all_runs) {
    print("calculating time at severe...")
    times <- as.numeric(lapply(all_runs, function(run) time_at_severe(run)))
    mean(times[times > 0])
}

get_time_at_severe_quantiles <- function(all_runs) {
    print("calculating time at severe quantiles...")
    times <- as.numeric(lapply(all_runs, function(run) time_at_severe(run)))
    quantile(times[times > 0], probs = c(0.1, 0.25, 0.5, 0.75, 0.9))
}

