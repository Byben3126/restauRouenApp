import { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { Container, Icon } from '@/components/atoms';
import Colors from '@/constants/Colors';
import { useLoader } from '@/context/Loader';
import { uploadImagesMyRestaurant, deleteImagesMyRestaurant } from '@/api/minted/restaurant';
import { useNotification } from '@/context/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { set_restaurant_data } from '@/store/slices/myRestaurant';
import * as Types from '@/types'
import { updateMyRestaurant } from '@/api/minted/restaurant';

// const images = [
//   { uri: 'https://picsum.photos/250/400' },
//   { uri: 'https://picsum.photos/600/600' },
//   { uri: 'https://picsum.photos/600/500' },
// ]

interface ImageCarouselProps {
  borderRadius?: number
  gap?: number
  paddingHorizontal?: number
  imageHeight?: number
}

interface ImageData {
  id: string, 
  uri: string
  path: string
  width: number
  height: number
}

interface ImageSized extends ImageData {
  width: number
  height: number
}

const PADDING_VERTICAL = 10
const GAP = 10

const ImageCarousel = ({borderRadius = 20, gap = 10, paddingHorizontal = 0, imageHeight = 200} : ImageCarouselProps) => {

  const restaurantData = useSelector((state:Types.Store) => state.myRestaurant.restaurantData);


  const [imageSizes, setImageSizes] = useState<ImageSized[]>([])

  const { setLoader } = useLoader()
  const { newNotification } = useNotification()
  const dispatch = useDispatch()


  useEffect(() => {

    const loadSizes = async () => {
      const images = JSON.parse(restaurantData.images)
      const sizes = await Promise.all<ImageSized>(
        images.map((path:string) => {
          const url = process.env.EXPO_PUBLIC_API_URL + path;
          return new Promise(resolve => {
            Image.getSize(url, (width, height) => {
              const ratio = width / height
              resolve({ 
                id: url, 
                uri: url,
                path: path,
                width: imageHeight * ratio, 
                height: imageHeight 
              })
            })
          })
        }) 
      )
      setImageSizes(sizes)
    }
    if (restaurantData) loadSizes()
  }, [restaurantData?.images])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
    });

    if (!result.canceled) {

      const MAX_SIZE = 20 * 1024 * 1024; // 20 Mo en octets
      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_SIZE) {
          newNotification({
            title: "Image trop volumineuse",
            subTitle: "La taille maximale autorisée est de 20 Mo.",
          });
          return;
        }
      }

      const files = result.assets.map((asset, idx) => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}_${idx}.jpg`,
        type: asset.type || 'image/jpeg',
      }));
      setLoader(true)
      try {
     
        const {data} = await uploadImagesMyRestaurant(files);
        dispatch(set_restaurant_data(data))
        console.log('uploadImagesMyRestaurant', data)
      } catch (e) {
          newNotification({
            title: "Ajout d'image impossible",
            subTitle: "Veuillez contacter le support",
          })
      }
      setLoader(false)
    }
  };

  const handlerChangeImagePosition = async (newImageSizes:ImageSized[]) => {
    console.log('handlerChangeImagePosition')
    setImageSizes(newImageSizes)
    try {
      const {data} = await updateMyRestaurant({
        images: JSON.stringify(newImageSizes.map(imageData => imageData.path)),
      })
      dispatch(set_restaurant_data(data))          
    } catch (error) {
      newNotification({
        title: 'Enregistrement impossible',
        subTitle: "Veuillez contacter le support",
      })
    }
  }

  const deleteImage = async (path:string) => {
    setLoader(true)
    try {
    
      const {data} = await deleteImagesMyRestaurant(path);
      setImageSizes(prev => prev.filter(image => image.path !== path))
      dispatch(set_restaurant_data(data))
      console.log('uploadImagesMyRestaurant', data)
    } catch (e) {
        newNotification({
          title: "Supression impossible",
          subTitle: "Veuillez réessayer plus tard",
        })
    }
    setLoader(false)
  }

  return (
    <DraggableFlatList
      data={imageSizes}
      horizontal={true}
      keyExtractor={(item, index) => item.id}
      showsHorizontalScrollIndicator={false}
      style={{maxHeight: imageHeight+PADDING_VERTICAL*2, paddingVertical: PADDING_VERTICAL}}
      contentContainerStyle={{paddingHorizontal}}
      overScrollMode='never'
      nestedScrollEnabled={true}
      onDragEnd={({ data }) => handlerChangeImagePosition(data)}
    
      ListHeaderComponent={
        <TouchableOpacity style={styles.buttonAdd} onPress={pickImage}>
          <Container.ColumnCenter style={styles.containerIconCamera}>
            <Icon.Ionicons name="camera-outline" size={25} color={"#fff"} />
          </Container.ColumnCenter>
        </TouchableOpacity>
      }

      renderItem={({ item, drag, isActive, getIndex }) => (
        <ScaleDecorator>
          <TouchableOpacity onLongPress={drag} disabled={isActive} style={{marginLeft: GAP}}>
            <TouchableOpacity onPress={()=>deleteImage(item.path)} style={styles.buttonDelete}>
              <Icon.Ionicons  color={Colors.primary} size={24} name='close-circle' />
            </TouchableOpacity>
           
            <Image
              source={{ uri: item.uri }}
              style={{ width: item.width, height: item.height, borderRadius}}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </ScaleDecorator>
      )}

      // ItemSeparatorComponent={()=> <View style={{width:GAP}}/>}
      
    />
  )
}

export default ImageCarousel


const styles = StyleSheet.create({
  buttonAdd: {
      height: '100%',
      width: 120,
      backgroundColor: '#F4F3F3',
      borderRadius: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
  containerIconCamera: {
    backgroundColor: Colors.black,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 30
    
  },
  buttonDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    // backgroundColor: '#fff',
  }
})