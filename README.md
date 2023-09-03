# Autonomous Software Agents project

## Configuration

Refer to main.js as an example for a single agent, to Agent_A.js and Agent_B.js as an example of two allied agents.
To start a simulation a running instance of the Deliveroo server is required.
Then create an instance of the Agent class specifying all the required arguments.
To start a simulation call the .configure method of the previously created agent.
To make a simulation end after a certain amount of milliseconds specify a number as argument of the configuration method.

If no token is specified in the constructor the agent will refer to the token specified in config.js.
To reduce the quantity of log messages set to false the *_LOG constants in config.js

## More competing agents on the same map

To have more independent instances of an agent on the same map:
    
- firstly collect the required number of token from the server
- create an instance of the agent specifying a token in the constructor
- call .configure on each new instance

## More allied agents on the same map

The procedure is the same as above, but you need also to generate a random string (whatever is fine) and specify it as communication_token in the constructor of each agent.


## Planning function options

- plan_simple : uses A*
- plan_pddl : uses PDDL (require internet connection)
- plan_pddl_2 : uses PDDL (require internet connection) but with fewer statements


## Other options

There are other options for the deliberation function anf for the intention revision function, but they do not work properly and have been deprecated.
