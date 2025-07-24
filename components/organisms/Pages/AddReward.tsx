import { StyleSheet, TouchableOpacity, Image, Platform, KeyboardAvoidingView, ScrollView} from "react-native";
import { useState, useMemo } from "react";
import { Button, Container, Text } from "@/components/atoms";
import { Input } from "@/components/molecules";
import Colors from "@/constants/Colors";
import { useNotification } from "@/context/Notification";
import { createReward } from "@/api/minted/reward";

type AddRewardProps = {
  closeCb?: ()=>void
}
const AddReward = ({closeCb}:AddRewardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rewardName, setRewardName] = useState<string | null>(null);
  const [pointRequired, setPointRequired] = useState<string | null>(null);
  
  
  //memo
  const validator = useMemo(
    () =>
      rewardName &&
      pointRequired &&
      !isNaN(parseInt(pointRequired)),
    [rewardName, pointRequired]
  );

  //context
  const { newNotification } = useNotification()

  const handlerSendNewReward = async () => {
    if (validator && pointRequired && rewardName) {
      setIsLoading(true)
      const payload = {
        name: rewardName,
        point_required: parseInt(pointRequired)
      }
      
      const res = await createReward(payload)
      setIsLoading(false)

      if (res.status == 200) {
        newNotification({
          title: 'Nouvelle récompense ajoutée !',
          subTitle: "Disponible pour tous vos clients",
          icon: {name: 'check-badge'},
        })

        if (closeCb) closeCb()
      }
    }
   
  }

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"position"} // Ajuste le comportement selon la plateforme
    >
        <Container.DismissKeyboard>
          <Container.View flexGrow={1}>
            <Container.ColumnCenter flexGrow={1} gap={30}>
              <Image style={[styles.image, {aspectRatio: 223/244}]} source={require('@/assets/images/add_reward.png')}/>
              <Text.SubTitle fontSize={24} lineHeight={24}>
                Nouvelle récompense
              </Text.SubTitle>
              <Container.Column gap={20}>
                <Input.MainInput
                  placeholderTextColor={Colors.grey}
                  placeholder="Nom de la récompense"
                  style={styles.input}
                  onChangeText={setRewardName}
                />
                <Input.MainInput
                  placeholderTextColor={Colors.grey}
                  placeholder="Points requis"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={styles.input}
                  onChangeText={setPointRequired}
                />
              </Container.Column>

              <TouchableOpacity onPress={handlerSendNewReward} style={{ width: "100%" }}>
                <Button.ButtonLandingPage loading={isLoading} style={{opacity: validator ? 1 : 0.5} }>
                  Envoyé
                </Button.ButtonLandingPage>
              </TouchableOpacity>
            </Container.ColumnCenter>
          </Container.View>
        </Container.DismissKeyboard>
    </KeyboardAvoidingView>
  );
};

export default AddReward;

const styles = StyleSheet.create({
    image: {
        width: '70%',
        height: 'auto',
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
