import React from 'react';
import { View, Text, Image } from 'react-native';

// Progress info - static for now
const ProgressInfo = () => {
  const milestones = [
    {
      title: 'Iteration 1',
      completedTasks: 10,
      totalTasks: 10,
    },
    {
      title: 'Iteration 2',
      completedTasks: 3,
      totalTasks: 25,
    },
    {
      title: 'Iteration 3',
      completedTasks: 0,
      totalTasks: 10,
    },
  ];

  const totalCompletedTasks = milestones.reduce(
    (acc, milestone) => acc + milestone.completedTasks,
    0
  );
  const totalTasks = milestones.reduce(
    (acc, milestone) => acc + milestone.totalTasks,
    0
  );
  const overallProgress = (totalCompletedTasks / totalTasks) * 100;

  return (
    <View>
      {/* Milestones Completed */}
      <View className='border-[#8971C4] border-[0.25px] rounded-[50%] mx-8 pb-5 px-5 py-4 mb-6'>
        <Text className='text-lg font-pbold text-center mb-2'>
          Milestones Completed
        </Text>

        {/* Milestone Progress */}
        {milestones.map((milestone, index) => {
          const milestoneProgress =
            (milestone.completedTasks / milestone.totalTasks) * 100;
          const iconSource =
            milestoneProgress === 100
              ? require('../../../assets/icons/tick-icon-circle.png')
              : require('../../../assets/icons/open-circle.png');

          return (
            <View
              key={index}
              className='flex-row items-center justify-center pt-4'>
              {/* Milestone Info */}
              <View className='flex-row items-center'>
                <Text className='text-sm font-pregular mr-3'>
                  {milestone.title}
                </Text>
                <View className='w-24 h-8 bg-[#E3D8FB] rounded-full overflow-hidden'>
                  {/* Background of progress bar */}
                  <View className='absolute w-full h-full bg-[#E3D8FB] rounded-full' />

                  {/* Filled in rectangle part */}
                  <View
                    className='absolute h-full bg-[#BDACE5] rounded-full'
                    style={{ width: '100%' }}
                  />
                  {/* Cover rectangle part */}
                  <View
                    className='absolute h-full bg-[#E3D8FB]'
                    style={{ left: `${milestoneProgress}%`, width: '100%' }}
                  />
                  <Text className='absolute mt-[5px] text-right pr-1 w-24 text-md font-bold'>
                    {milestoneProgress}%
                  </Text>
                </View>
              </View>
              {/* Task Info */}
              <Text className='w-26 text-sm font-pregular pl-3'>
                {milestone.completedTasks}/{milestone.totalTasks} Tasks
              </Text>
              {/* Conditional Tick Icon */}
              <Image source={iconSource} className='w-6 h-6 ml-2 mb-[2px]' />
            </View>
          );
        })}
      </View>

      {/* Overall Tasks Progress */}
      <View className='border-[#8971C4] border-[0.25px] rounded-[50%] mx-8 px-5 py-4 mb-12'>
        <Text className='text-lg font-pbold text-center'>
          <Text className='text-[#8971C4]'>{overallProgress.toFixed(1)}%</Text>
          <Text className='text-black'> {' Overall Tasks Complete'}</Text>
        </Text>

        {/* Milestone progress rectangles */}
        <View className='flex-row justify-center gap-2 pt-2'>
          {milestones.map((milestone, index) => (
            <View
              key={index}
              className={`w-16 h-3 ${
                milestone.completedTasks === milestone.totalTasks
                  ? 'bg-[#8971C4]'
                  : 'bg-white'
              } border-[#000000] border-[0.25px] rounded-full`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProgressInfo;
