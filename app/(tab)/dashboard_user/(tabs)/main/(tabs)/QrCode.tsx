import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, {useState, useCallback} from 'react'
import { useSelector } from 'react-redux'
import { Container, Text, Button } from '@/components/atoms'
import QRCode from 'react-native-qrcode-svg';
import { useFocusEffect } from '@react-navigation/native';
import { getLinkCodeToken } from '@/api/minted/user';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

import * as Types from '@/types';

import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from './../_layout';



const QrCode = () => {
    let logoFromFile = require('@/assets/images/paypal.png');


    const user = useSelector((state:Types.Store) => state.user.value);
    
    if (!user) return null;

    //context
    const TabNavigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

    return (
        <SafeAreaView style={{ flex: 1}}>
            <Container.View flexGrow={1}>
                <Container.ColumnCenter flexGrow={1} gap={40}>
                    <Container.ColumnCenterX gap={10}>
                        <Text.SubTitle fontSize={24} lineHeight={24}>Votre Qr Code</Text.SubTitle>
                        <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={20} textAlign='center'>
                            {'Montrez ce code QR au restaurateur\npour profiter des avantages !'}
                        </Text.Paragraphe>
                    </Container.ColumnCenterX>
                
                    <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={20} lineHeight={20} textAlign='center'>
                        Code: {user.link_code}
                    </Text.Paragraphe>
                    <View style={styles.qrcodeContainer}>
                        <View style={[styles.corner, styles.cornerTopLeft]}/>
                        <View style={[styles.corner, styles.cornerTopRight]}/>
                        <View style={[styles.corner, styles.cornerBottomRight]}/>
                        <View style={[styles.corner, styles.cornerBottomLeft]}/>
                        <QRCode
                            value={user.link_code}
                            size={150}
                            // logo={logoFromFile}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => TabNavigation.navigate('(tabs)/Offers')}>
                        <Button.ButtonLandingPage style={styles.button}>Voir mes offres</Button.ButtonLandingPage>
                    </TouchableOpacity>
                </Container.ColumnCenter>
            </Container.View>
        </SafeAreaView>
    )
}

export default QrCode

const cornerRadius = 15;
const cornerWidth = 50;
const cornerOffset = 20;
const cornerBorderWidth = 2;

const styles = StyleSheet.create({
    button: {
        width: 'min-content',
        paddingHorizontal: 40,
    },
    qrcodeContainer: {
        position: 'relative',
        marginVertical: cornerOffset,
    },
    corner: {
        height: cornerWidth,
        width: cornerWidth,    
        position: 'absolute',
        zIndex:1,
        borderColor: '#000',
    },
    cornerTopLeft: {
        top: -cornerOffset,
        left: -cornerOffset,
        borderTopWidth: cornerBorderWidth,
        borderLeftWidth: cornerBorderWidth,
        borderTopLeftRadius: cornerRadius
    },
    cornerTopRight: {
        top: -cornerOffset,
        right: -cornerOffset,
        borderTopWidth: cornerBorderWidth,
        borderRightWidth: cornerBorderWidth,
        borderTopRightRadius: cornerRadius
    },
    cornerBottomLeft: {
        bottom: -cornerOffset,
        left: -cornerOffset,
        borderBottomWidth: cornerBorderWidth,
        borderLeftWidth: cornerBorderWidth,
        borderBottomLeftRadius: cornerRadius
    },
    cornerBottomRight: {
        right: -cornerOffset,
        bottom: -cornerOffset,
        borderBottomWidth: cornerBorderWidth,
        borderRightWidth: cornerBorderWidth,
        borderBottomRightRadius: cornerRadius
    }

})