import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native'
import {Container, Text, Button} from '@/components/atoms'
import React, {} from 'react'
import QRCode from 'react-native-qrcode-svg';

type qrCodeViewProps = {
    title:string
    qrCodeValue:string
    cbButton?: () => void
}

const QrCodeView = ({title, qrCodeValue, cbButton}:qrCodeViewProps) => {
    return (

        <SafeAreaView style={{ flex: 1}}>
            <Container.View flexGrow={1}>
                <Container.ColumnCenter flexGrow={1} gap={40}>
                    <Container.ColumnCenterX gap={10}>
                        <Text.SubTitle fontSize={24} lineHeight={24}>Votre Qr Code</Text.SubTitle>
                        <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={20} textAlign='center'>
                            {'Présentez ce QR code au restaurant pour recuperer la récompenses.'}
                        </Text.Paragraphe>
                    </Container.ColumnCenterX>
                
                    <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={20} lineHeight={20} textAlign='center'>
                        {title}
                    </Text.Paragraphe>
                    <View style={styles.qrcodeContainer}>
                        <View style={[styles.corner, styles.cornerTopLeft]}/>
                        <View style={[styles.corner, styles.cornerTopRight]}/>
                        <View style={[styles.corner, styles.cornerBottomRight]}/>
                        <View style={[styles.corner, styles.cornerBottomLeft]}/>
                        <QRCode
                            value={qrCodeValue}
                            size={150}
                            // logo={logoFromFile}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.6} onPress={cbButton}>
                        <Button.ButtonLandingPage style={{width:'auto', paddingHorizontal:30}}>Retour</Button.ButtonLandingPage>
                    </TouchableOpacity>
                </Container.ColumnCenter>
            </Container.View>
        </SafeAreaView>
    )
}

export default QrCodeView

const cornerRadius = 15;
const cornerWidth = 50;
const cornerOffset = 20;
const cornerBorderWidth = 2;

const styles = StyleSheet.create({
    button: {
        // paddingHorizontal: 40,
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