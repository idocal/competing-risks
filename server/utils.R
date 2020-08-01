NO_STATE_CHANGE = 0
RECOVERED_OR_OOHQ = 16
MILD_OR_MODERATE = 23
SEVERE = 4
DECEASED = 5

TERMINAL_STATES = c(DECEASED)

MAX_PATH_LENGTH = 9



construct_multi_state_model_dataset = function() {
  df = read.csv('./data/malka_dataframe_right_before_analysis.csv')
  
  df = df[!is.na(df$age),]
  df = df[!is.na(df$sex),]
  
  # these 0 values are only used for initialization 
  # values for each state are updated according to the transition function when fitting the model.
  df$was_severe = 0
  df$cumulative_time = 0
  initial_covariates_df = as.data.frame(model.matrix(~age*sex+age*as.factor(type0)+age*cumulative_time+age*was_severe, df))
  
  covariate_names = tail(names(initial_covariates_df), n=-1) # exclude intercept generated from model.matrix
  non_covariate_column_names = c('source_state', 'target_state', 'tstop', 'tstart', 'id', 'first_date', 'hospital')
  
  df = cbind(initial_covariates_df[,covariate_names], df[,non_covariate_column_names])
  
  head(df, n=5)
  
  
  construct_one_object = function(id) {
    
    patient_data = df[df$id == id,]
    
    # construct the series of states visited:
    states = c(patient_data$source_state)
    last_state = tail(patient_data$target_state, n=1)
    if (last_state != NO_STATE_CHANGE) states = c(states, last_state)
    
    time_at_each_state = patient_data$tstop - patient_data$tstart
    
    # covariates at time of hospitalization:
    covariates = as.numeric(patient_data[1, covariate_names])
    
    object = list(
      covariates = covariates,
      states = states,
      time_at_each_state = time_at_each_state,
      id = id,
      
      date_of_hospitalization = as.Date(patient_data$first_date[1]),
      hospital = as.character(patient_data$hospital[1])
    )
    
    return(object)
  }
  
  
  dataset = lapply(unique(df$id), function(id) construct_one_object(id))
}


get_corona_model_covariate_names = function() {
  df = read.csv('./data/malka_dataframe_right_before_analysis.csv')

  df = df[!is.na(df$age),]
  df = df[!is.na(df$sex),]

  # these 0 values are only used for initialization
  # values for each state are updated according to the transition function when fitting the model.
  df$was_severe = 0
  df$cumulative_time = 0
  initial_covariates_df = as.data.frame(model.matrix(~age*sex+age*as.factor(type0)+age*cumulative_time+age*was_severe, df))

  covariate_names = tail(names(initial_covariates_df), n=-1) # exclude intercept generated from model.matrix

  return(covariate_names)
}



# function for overwriting the mild or moderate model, in order to deal with non-convergence.
get_modified_mild_or_moderate_to_deceased_cox_model = function(model, dataset, terminal_states, update_covariates){
  
  competing_risks_dataset = model$prepare_dataset_for_competing_risks_fit(dataset = dataset,
                                                                          terminal_states = terminal_states,
                                                                          update_covariates_function = update_covariates)
  
  type0_3_or_4 = competing_risks_dataset[,"as.factor(type0)3"] | competing_risks_dataset[,"as.factor(type0)4"]
  modified_covariates = data.frame(
    'age' = competing_risks_dataset$age,
    'sexMale' = competing_risks_dataset$sexMale,
    'type0-3or4' = type0_3_or_4,
    'cumulative_time' = competing_risks_dataset$cumulative_time,
    'age:sexMale' = competing_risks_dataset$`age:sexMale`,
    'age:type0-3or4' = competing_risks_dataset$age * type0_3_or_4,
    'age:cumulative-time' = competing_risks_dataset$age * competing_risks_dataset$cumulative_time
  )
  
  
  modified_covariate_names = colnames(modified_covariates)
  
  non_covariate_column_names = c('origin_state', 'target_state', 't_entry_to_origin_state', 't_transition_to_target_state', ID, WEIGHT)
  non_covariate_column_names = non_covariate_column_names[non_covariate_column_names %in% colnames(competing_risks_dataset)] # might not have weight
  modified_competing_risks_dataset = cbind(competing_risks_dataset[, non_covariate_column_names], modified_covariates)
  
  modified_mild_or_moderate_cr_model = model$fit_state_specific_model(state = MILD_OR_MODERATE,
                                                                      competing_risks_dataset = modified_competing_risks_dataset,
                                                                      covariate_names_ = modified_covariate_names)
  
  print("The fitted Cox Model from State Mild or Moderate to DECEASED")
  print(modified_mild_or_moderate_cr_model$event_specific_models[[DECEASED]])
  
  coefs = modified_mild_or_moderate_cr_model$event_specific_models[[DECEASED]]$coefficients 
  # The reorganized regression coefficient vector= (b1 , b2 , b3 , b3 , b4 , 0 , b5 , b6 , b6 , b7 , 0):
  new_coefs = c(coefs[c(1,2,3,3,4)], 0, coefs[c(5,6,6,7)],0)
  modified_mild_or_moderate_cr_model$event_specific_models[[DECEASED]]$coefficients = new_coefs
  
  return(modified_mild_or_moderate_cr_model$event_specific_models[[DECEASED]])
}


# function for overwriting the recovered_or_oohq to mild_or_moderate model, in order to deal with non-convergence.
get_modified_recovered_or_oohq_to_mild_or_moderate_cox_model = function(model, dataset, terminal_states, update_covariates){
  
  competing_risks_dataset = model$prepare_dataset_for_competing_risks_fit(dataset = dataset,
                                                                          terminal_states = terminal_states,
                                                                          update_covariates_function = update_covariates)
  
  type0_3_or_4 = competing_risks_dataset[,"as.factor(type0)3"] | competing_risks_dataset[,"as.factor(type0)4"]
  modified_covariates = data.frame(
    'age' = competing_risks_dataset$age,
    'sexMale' = competing_risks_dataset$sexMale,
    'type0-3or4' = type0_3_or_4,
    'cumulative_time' = competing_risks_dataset$cumulative_time,
    'age:sexMale' = competing_risks_dataset$`age:sexMale`,
    'age:type0-3or4' = competing_risks_dataset$age * type0_3_or_4,
    'age:cumulative-time' = competing_risks_dataset$age * competing_risks_dataset$cumulative_time
  )
  
  
  modified_covariate_names = colnames(modified_covariates)
  
  non_covariate_column_names = c('origin_state', 'target_state', 't_entry_to_origin_state', 't_transition_to_target_state', ID, WEIGHT)
  non_covariate_column_names = non_covariate_column_names[non_covariate_column_names %in% colnames(competing_risks_dataset)] # might not have weight
  modified_competing_risks_dataset = cbind(competing_risks_dataset[, non_covariate_column_names], modified_covariates)
  
  modified_recovered_or_oohq_cr_model = model$fit_state_specific_model(state = RECOVERED_OR_OOHQ,
                                                                      competing_risks_dataset = modified_competing_risks_dataset,
                                                                      covariate_names_ = modified_covariate_names)
  
  print("The fitted Cox Model from State RECOVERED_OR_OOHQ to MILD_OR_MODERATE")
  print(modified_recovered_or_oohq_cr_model$event_specific_models[[MILD_OR_MODERATE]])
  
  coefs = modified_recovered_or_oohq_cr_model$event_specific_models[[MILD_OR_MODERATE]]$coefficients 
  # The reorganized regression coefficient vector= (b1 , b2 , b3 , b3 , b4 , 0 , b5 , b6 , b6 , b7 , 0):
  new_coefs = c(coefs[c(1,2,3,3,4)], 0, coefs[c(5,6,6,7)],0)
  modified_recovered_or_oohq_cr_model$event_specific_models[[MILD_OR_MODERATE]]$coefficients = new_coefs
  
  return(modified_recovered_or_oohq_cr_model$event_specific_models[[MILD_OR_MODERATE]])
}



AGE_COVARIATE_INDEX = 1
CUMULATIVE_TIME_COVARIATE_INDEX = 5
CUMULATIVE_TIME_INTERACTION_WITH_AGE_COVARIATE_INDEX = 10
PATIENT_WAS_SEVERE_COVARIATE_INDEX = 6
PATIENT_WAS_SEVERE_INTERACTION_WITH_AGE_COVARIATE_INDEX = 11


update_covariates = function(sample_covariates, origin_state, target_state, time_at_origin_state, absolute_time_of_entry_to_target_state=NULL) {
  new_covariates = sample_covariates
  
  # update 'patient was _severe'
  if (origin_state == SEVERE) {
    new_covariates[PATIENT_WAS_SEVERE_COVARIATE_INDEX] = 1
    new_covariates[PATIENT_WAS_SEVERE_INTERACTION_WITH_AGE_COVARIATE_INDEX] = sample_covariates[AGE_COVARIATE_INDEX]
  }
  
  # update cumulative time
  new_covariates[CUMULATIVE_TIME_COVARIATE_INDEX] = new_covariates[CUMULATIVE_TIME_COVARIATE_INDEX] + time_at_origin_state
  
  if (!is.null(absolute_time_of_entry_to_target_state) && 
      absolute_time_of_entry_to_target_state > new_covariates[CUMULATIVE_TIME_COVARIATE_INDEX]) {
    new_covariates[CUMULATIVE_TIME_COVARIATE_INDEX] = absolute_time_of_entry_to_target_state
  }
  
  
  new_covariates[CUMULATIVE_TIME_INTERACTION_WITH_AGE_COVARIATE_INDEX] = new_covariates[CUMULATIVE_TIME_COVARIATE_INDEX]*new_covariates[AGE_COVARIATE_INDEX]
  
  return(new_covariates)
}



probability_of_death = function(all_runs) {
  return(mean(sapply(all_runs, function(run) tail(run$states, n=1) == DECEASED)))
}

probability_of_severe = function(all_runs) {
  return(mean(sapply(all_runs, function(run) SEVERE %in% run$states)))
}


time_at_hospital = function(monte_carlo_run) {
  states = monte_carlo_run$states
  time_at_each_state = monte_carlo_run$time_at_each_state
  
  if (length(states) > length(time_at_each_state)){
    states = head(states, -1)
  }
  
  return(sum(time_at_each_state[states != RECOVERED_OR_OOHQ]))
}


truncated_mean_time_hospitalized = function(all_runs) {
  t = sapply(all_runs, function(run) time_at_hospital(run) )
  return(mean(t, trim=0.1))
}


QUANTILES = c(0.10,
              0.25,
              0.5,
              0.75,
              0.90)

quantiles_of_time_hospitalized = function(all_runs) {
  t = sapply(all_runs, function(run) time_at_hospital(run) )
  return(quantile(t, probs=QUANTILES))
}


quantile_of_time_hospitalized = function(all_runs, q) {
  t = sapply(all_runs, function(run) time_at_hospital(run) )
  return(quantile(t, probs=q))
}


time_at_severe = function(monte_carlo_run) {
  states = monte_carlo_run$states
  time_at_each_state = monte_carlo_run$time_at_each_state
  
  if (length(states) > length(time_at_each_state)){
    states = head(states, -1)
  }
  
  return(sum(time_at_each_state[states == SEVERE]))
}

truncated_mean_time_at_severe = function(all_runs) {
  t = sapply(all_runs, function(run) time_at_severe(run) )
  return(mean(t, trim=0.1))
}


quantile_of_time_at_severe = function(all_runs, q) {
  t = sapply(all_runs, function(run) time_at_severe(run) )
  if (length(t[t > 0]) == 0) return(0)
  return(quantile(t[t > 0], probs=q, na.rm = TRUE))
}

# if time at severe was 0, ie sample was not in severe - sample was excluded
quantiles_of_time_at_severe = function(all_runs) {
  t = sapply(all_runs, function(run) time_at_severe(run) )
  return(quantile(t[t > 0], probs=QUANTILES, na.rm = TRUE))
}