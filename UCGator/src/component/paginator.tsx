import React from 'react'

import { StyleSheet, View } from 'react-native'

interface PaginatorProp {
    count: number;
}


const Paginator: React.FC<PaginatorProp> = ({ count }) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, i) => (
                <View style={styles.dot} key={i.toString()} />
            ))}
        </View>
    );
};

export default Paginator

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 64
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: 'blue',
        marginHorizontal: 8
    }
})