import { FontAwesome } from '@expo/vector-icons';

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSquareCaretRight
} from '@fortawesome/free-solid-svg-icons';

import { BarChart } from 'react-native-chart-kit';

// RECT
import React from 'react';
import { useState, useEffect } from 'react';

// ROUTER
import { useRouter } from 'expo-router';

// COMPONENTS
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

const { width } = Dimensions.get('window');

// Weather interface
interface WeatherData {
  location: {
    name: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const Explore = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('widelyNavigated');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Define fetchWeather outside of useEffect so we can reuse it
  const fetchWeather = async () => {
    try {
      // Get weather API key from environment variable
      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API;
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Mandaue&aqi=no`
      );

      if (!response.ok) {
        throw new Error('Weather data not available');
      }      const data = await response.json();
      setWeather(data);
      setLastUpdated(new Date());
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError('Failed to load weather data');
      console.error(err?.response?.message || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing state
    }
  };
  
  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeather();
  }, []);

  // Format date for weather display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    };

    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 50 }}>
      <StatusBar backgroundColor='white' barStyle={'dark-content'} />
      <SafeAreaView>
        <View style={{ paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 24, color: COLORS.blue1 }}>Explore</Text>
          <View>
            <TouchableOpacity onPress={() => router.push('/(root)/navigate/start-navigation')}>
              <FontAwesomeIcon icon={faSquareCaretRight} size={32} color={COLORS.blue1} />
            </TouchableOpacity>
          </View>
        </View>        
        <ScrollView 
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.blue1]}
              tintColor={COLORS.blue1}
              title="Refreshing weather data..."
              titleColor={COLORS.blue1}
            />
          }
        >
          <View>
            {/* WEATHER HERE */}
            <View style={styles.weatherContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.white} />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : weather ? (
                <>
                  <View style={styles.weatherLeftContent}> 
                    <Text style={styles.weatherDate}>{formatDate(weather.location.localtime)}</Text>
                    <Text style={styles.weatherCondition}>{weather.current.condition.text}</Text>
                    <Text style={styles.weatherTemp}>{Math.round(weather.current.temp_c)}</Text>
                  </View>
                  <View style={styles.weatherRightContent}>
                    <Image
                      source={{ uri: `https:${weather.current.condition.icon.replace('64x64', '128x128')}` }}
                      style={styles.weatherIcon}
                    />
                  </View>
                </>
              ) : null}
            </View>
            <View style={{ paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'Montserrat-Light', fontSize: 12, color: '#777' }}>This data is only to the UCLM location.</Text>              
              {lastUpdated && (
                <Text style={{ fontFamily: 'Montserrat-Light', fontSize: 12, color: '#777' }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Text>
              )}
            </View>

            <View style={{ paddingHorizontal: 15, marginVertical: 10 }}>
              {/* Frquent Activity*/}
              <View style={{ marginBottom: 12 }}>
                <View>
                  <Text style={{ fontFamily: 'Montserrat-Bold', letterSpacing: 2, fontSize: 22, color: COLORS.blue1 }}>Activity</Text>
                </View>
                <View>
                  <BarChart
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                      datasets: [
                        {
                          data: [
                            Math.random() * 10,
                            Math.random() * 10,
                            Math.random() * 10,
                            Math.random() * 10,
                            Math.random() * 10,
                            Math.random() * 10
                          ]
                        }
                      ]
                    }}
                    width={width - 30}
                    height={200}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                      backgroundColor: COLORS.blue1,
                      backgroundGradientFrom: COLORS.blue1,
                      backgroundGradientTo: "#4A7093",
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 8,
                      },
                      barPercentage: 0.5,
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                      }
                    }}
                    style={{
                      borderRadius: 15,
                    }}
                  />
                </View>
              </View>
              {/* MY HISTORY */}
              <View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: 'Montserrat-Bold', letterSpacing: 2, fontSize: 22, color: COLORS.blue1 }}>History</Text>
                  <Text style={{ fontFamily: 'Montserrat-Regular', letterSpacing: 1.5, fontSize: 14, color: COLORS.blue1 }}>From your navigation history.</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10, marginBottom: 5 }}>
                  <TouchableOpacity style={{ marginRight: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, }}>
                      <Image source={{ uri: 'https://bing.com/th?id=OSGI.EF9B16C8B542C18EAEE2E36F00538387&h=1000&w=1920&c=1&rs=1' }} style={{ width: 150, height: 150, borderRadius: 15 }} />
                      <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.blue1, marginVertical: 5 }}>Cashier</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', marginVertical: 5 }}>5 days ago</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, }}>
                      <Image source={{ uri: 'https://lh3.googleusercontent.com/p/AF1QipNVZXePaunX1mFKoOKXa0Nr0iy8BhHNh8lkEWR-=w600-k' }} style={{ width: 150, height: 150, borderRadius: 15 }} />
                      <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.blue1, marginVertical: 5 }}>Cashier</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', marginVertical: 5 }}>5 days ago</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, }}>
                      <Image source={{ uri: 'https://bing.com/th?id=OSGI.EF9B16C8B542C18EAEE2E36F00538387&h=1000&w=1920&c=1&rs=1' }} style={{ width: 150, height: 150, borderRadius: 15 }} />
                      <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.blue1, marginVertical: 5 }}>Cashier</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', marginVertical: 5 }}>5 days ago</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              {/* FREQUENTLY NAVIGATED */}
              <View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontFamily: 'Montserrat-Bold', letterSpacing: 2, fontSize: 22, color: COLORS.blue1 }}>Frequently Visited</Text>
                  <Text style={{ fontFamily: 'Montserrat-Regular', letterSpacing: 1.5, fontSize: 14, color: COLORS.blue1 }}>From global data.</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                  <TouchableOpacity style={{ marginRight: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, }}>
                      <Image source={{ uri: 'https://bing.com/th?id=OSGI.EF9B16C8B542C18EAEE2E36F00538387&h=1000&w=1920&c=1&rs=1' }} style={{ width: 150, height: 150, borderRadius: 15 }} />
                      <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.blue1, marginVertical: 5 }}>Cashier</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', marginVertical: 5 }}>5 days ago</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, }}>
                      <Image source={{ uri: 'https://bing.com/th?id=OSGI.EF9B16C8B542C18EAEE2E36F00538387&h=1000&w=1920&c=1&rs=1' }} style={{ width: 150, height: 150, borderRadius: 15 }} />
                      <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.blue1, marginVertical: 5 }}>Cashier</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', marginVertical: 5 }}>800 Visits</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginRight: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, }}>
                      <Image source={{ uri: 'https://bing.com/th?id=OSGI.EF9B16C8B542C18EAEE2E36F00538387&h=1000&w=1920&c=1&rs=1' }} style={{ width: 150, height: 150, borderRadius: 15 }} />
                      <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.blue1, marginVertical: 5 }}>Cashier</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', marginVertical: 5 }}>5 days ago</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Explore;

/**
 * @constant COLORS
 * @description Color palette used throughout the Explore component
 * 
 * @property {string} blue1 - Primary blue color (#2B4F6E)
 * @property {string} white - Background and text color (#F6F6F6)
 * @property {string} red - Accent color for sections (#FF0000)
 */
const COLORS = {
  blue1: '#2B4F6E',
  white: '#F6F6F6',
  red: '#FF0000',
};

const styles = StyleSheet.create({
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.blue1,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    height: 170,
  },
  weatherLeftContent: {
    flex: 3,
    paddingRight: 10,
  },
  weatherRightContent: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  weatherDate: {
    color: COLORS.white,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    marginBottom: 2,
  },
  weatherCondition: {
    color: COLORS.white,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginTop: 2,
  },
  weatherTemp: {
    color: COLORS.white,
    fontFamily: 'Montserrat-Bold',
    fontSize: 80,
    lineHeight: 90,
    marginTop: -5,
  },
  weatherIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  errorText: {
    color: COLORS.white,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    padding: 10,
  },
});
