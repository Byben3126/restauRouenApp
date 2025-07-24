import { StyleSheet, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView} from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import { Button, Container, Text } from "@/components/atoms";
import { Input } from "@/components/molecules";
import Colors from "@/constants/Colors";
import DateTimePicker from "react-native-modal-datetime-picker";
import { create_promotion_for_everyone, create_promotion_for_inactive_customers, create_promotion_for_specific_customer } from "@/api/minted/promotion"; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useNotification } from "@/context/Notification";

import * as Types from '@/types';
const buttons = [
  { id: "everyone", title: "Pour tous", width: 200 },
  { id: "inactiveUser", title: "Clients inactifs", width: 250 },
  { id: "specificUser", title: "Client spécifique", width: 300 },
];


type RootStackDefault = {
  NewOffer: { customer?: Types.Customer };
};
export interface NewOfferProps {
  navigation: NativeStackNavigationProp<RootStackDefault, 'NewOffer'>;
  route: RouteProp<RootStackDefault, 'NewOffer'>;
}


const NewOffer = ({ navigation, route}: NewOfferProps) => {

  const [personTypeSelected, setPersonTypeSelected] = useState('everyone')
  const [expireDate, setExpireDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [promotionContent, setPromotionContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  
  //context
  const { newNotification } = useNotification()


  //memo
  const validator = useMemo(
    () => (
      expireDate &&
      promotionContent
    ),
    [expireDate, promotionContent]
  );

  const handlerSendNewOffer = async () => {
    if (validator && promotionContent && expireDate) {
      setIsLoading(true);

      const payload = {
        name: promotionContent,
        expires_at: expireDate.toISOString(),
      };

      try {
        let res;
        if (route.params?.customer) {
           res = await create_promotion_for_specific_customer(route.params.customer.id ,payload);
        }else{
          // Envoi de la requête selon le type de personne sélectionné
          switch (personTypeSelected) {
            case "everyone":
              res = await create_promotion_for_everyone(payload);
              break;
            case "inactiveUser":
              res = await create_promotion_for_inactive_customers(payload);
              break;
            default:
              throw new Error("Type de personne sélectionné invalide.");
          }
        }

       
        // Vérification du statut de la réponse
        if (res?.status === 200) {
          let title = "Nouvelle offre ajoutée !"
          let subTitle = personTypeSelected == 'everyone' ? "Disponible pour tout les clients." : "Envoyé aux clients innactifs."

          if (route.params?.customer) {
            title = "Nouvelle offre envoyé !"
            subTitle ="Disponible dès mainteant pour " + route.params.customer?.user?.identity.first_name + "."
          }

          navigation.goBack();
          newNotification({
            title,
            subTitle,
            icon: { name: "check-badge" },
          });
        } else {
          throw new Error("Échec de l'ajout de l'offre.");
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'offre :", error);

        newNotification({
          title: "Impossible d'ajouter l'offre",
          subTitle: "Veuillez réessayer ultérieurement.",
          icon: { name: "exclamation-circle" },
        });
      }

      setIsLoading(false);
    } 
    
  };

  useEffect(()=>{
    if (personTypeSelected == 'specificUser') {
      navigation.goBack();
      setTimeout(() => {
        navigation.getParent()?.navigate("Users")
      }, 200);

    }
  },[personTypeSelected])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"position"} // Ajuste le comportement selon la plateforme
    >
      <Container.DismissKeyboard>
          <Container.ColumnCenter flexGrow={1} gap={30} style={{height: '100%'}}>
            <Text.SubTitle fontSize={24} lineHeight={24}>
              Nouvelle offre
            </Text.SubTitle>
            { !route.params?.customer && <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{height: 46, maxHeight:46}}
              contentContainerStyle={styles.scrollViewContainer}
            >
              <Container.View style={styles.navButton}>
                {buttons.map((button) => (
                  <TouchableOpacity style={styles.navButton} onPress={()=>setPersonTypeSelected(button.id)}>
                    { 
                      personTypeSelected === button.id &&
                      <Button.ButtonRadius>{button.title}</Button.ButtonRadius> ||
                      <Button.ButtonRadiusOutline>{button.title}</Button.ButtonRadiusOutline>  

                    }
                  </TouchableOpacity>
                ))}
              </Container.View>
            </ScrollView>}
            <Container.View>
              <Container.Column gap={20}>       
                {/* <Input.MainInput
                  placeholderTextColor={Colors.grey}
                  placeholder="The name of the user"
                  style={styles.input}
                /> */}
                <Input.MainInput
                  placeholderTextColor={Colors.grey}
                  placeholder="Contenu de l'offre"
                  style={styles.inputTextarea}
                  inputStyle={styles.inputStyleTextarea}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={setPromotionContent}
                />

                <Input.MainInput
                  placeholderTextColor={Colors.grey}
                  placeholder="Date"
                  style={styles.input}
        
                  editable={false}
                  onPressOut={() => setDateTimePickerVisible(true)}
                  value={'Expire le ' + expireDate.toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  
                />  



              <DateTimePicker
                onConfirm={(date) => {
                  setDateTimePickerVisible(false);
                  setExpireDate(date);
                }}
                onCancel={() => setDateTimePickerVisible(false)}
                isVisible={dateTimePickerVisible}
                date={expireDate}
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                minimumDate={new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)}
              />
            
              </Container.Column>
            </Container.View>
            <Container.View>
              <TouchableOpacity onPress={handlerSendNewOffer} style={{ width: "100%" }}>
                <Button.ButtonLandingPage loading={isLoading} style={{opacity: validator ? 1 : 0.5} }>
                  Envoyé
                </Button.ButtonLandingPage>
              </TouchableOpacity>
            </Container.View>
          
          </Container.ColumnCenter>
      </Container.DismissKeyboard>
    </KeyboardAvoidingView>
  );
};

export default NewOffer;

const styles = StyleSheet.create({
  scrollViewContainer: {
  },
  navButton: {
    display: "flex",
    flexDirection: "row",
    gap: 10,

  },
  input: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputTextarea: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 120,
    textAlignVertical: "top",
  },
  inputStyleTextarea: {
    lineHeight: 20,
  },
  datePicker: {
    backgroundColor: "#fff",
    height: 56,
    borderColor: "#71717A",
    borderWidth: 1,
    borderRadius: 24,
    width: 300,
  },
});
