import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const PostFilterModal = ({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  dateOrder,
  setDateOrder,
  timeFrame,
  setTimeFrame,
  onApplyFilter,
}) => {
  const FilterOption = ({ text, isSelected, onPress, fullWidth }) => (
    <TouchableOpacity
      className={`${
        isSelected ? 'bg-[#275BBC]' : 'bg-blue-50'
      } py-2 rounded-full ${fullWidth ? 'flex-1' : 'w-[90px]'} `}
      onPress={onPress}>
      <Text
        className={`${
          isSelected ? 'text-white' : 'text-[#275BBC]'
        } text-center text-sm`}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable
        className='flex-1 justify-center items-center bg-black bg-opacity-50'
        onPress={onClose}>
        <View className='bg-white rounded-xl p-6 w-5/6 max-w-[400px]'>
          <View className='flex-row justify-between items-center mb-5'>
            <Text className='text-lg font-semibold'>Filter Selection</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name='close' size={24} color='#000' />
            </TouchableOpacity>
          </View>

          <Text className='text-lg font-medium mt-4 mb-2'>Search</Text>
          <TextInput
            className='rounded-md p-3 border border-gray-300 mb-4'
            placeholder='Search Posts'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Text className='text-lg font-medium mt-4 mb-2'>Date/Time</Text>
          <View className='flex-row justify-center gap-2'>
            {/* Set fullWidth to true for these buttons */}
            <FilterOption
              text='New to Old'
              isSelected={dateOrder === 'newToOld'}
              onPress={() => setDateOrder('newToOld')}
              fullWidth={true}
            />
            <FilterOption
              text='Old to New'
              isSelected={dateOrder === 'oldToNew'}
              onPress={() => setDateOrder('oldToNew')}
              fullWidth={true}
            />
          </View>

          <Text className='text-lg font-medium mt-4 mb-2'>Time Frame</Text>
          {/* Container now uses flexbox row, and will wrap the items correctly */}
          <View className='flex-row flex-wrap justify-center gap-2'>
            <FilterOption
              text='Today'
              isSelected={timeFrame === 'today'}
              onPress={() => setTimeFrame('today')}
            />
            <FilterOption
              text='Past Week'
              isSelected={timeFrame === 'pastWeek'}
              onPress={() => setTimeFrame('pastWeek')}
            />
            <FilterOption
              text='Past Month'
              isSelected={timeFrame === 'pastMonth'}
              onPress={() => setTimeFrame('pastMonth')}
            />
            <FilterOption
              text='All Time'
              isSelected={timeFrame === 'allTime'}
              onPress={() => setTimeFrame('allTime')}
            />
          </View>

          <TouchableOpacity
            className='bg-[#275BBC] py-3 rounded-lg items-center mt-6'
            onPress={onApplyFilter}>
            <Text className='text-white text-lg font-semibold'>
              Apply Filter
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PostFilterModal;
