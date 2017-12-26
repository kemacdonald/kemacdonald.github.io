#!/bin/bash
# Deploy script for goal-actions web experiment

DIRECTORY="../../../kemacdonald.github.io/experiments/soc_info_goal_actions"


if [ ! -d "$DIRECTORY" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  mkdir $DIRECTORY
fi


# copy the experiment files to github experiment library
cp -r * ../../../kemacdonald.github.io/experiments/soc_info_goal_actions

echo "Finished copying experiment!"