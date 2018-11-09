import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';



const styles = StyleSheet.create({
    container: {
    },
    bigText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#000000'
    },
    mainText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000000'
    }
});


export default class Forecast extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.bigText}>
                    {this.props.main}
                </Text>
                <Text style={styles.mainText}>
                    风向:{this.props.description}
                </Text>
                <Text style={styles.bigText}>
                    {this.props.temp} 摄氏度
                </Text>
            </View>
        );
    }
}
