import React, { useState, createContext, useContext } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, ScrollView, Alert, SafeAreaView 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; 

// --- 1. البيانات الوهمية (Mock Data) ---
const CATEGORIES = ["الكل", "مأكولات بحرية", "ساندويشات", "أطباق رئيسية", "شوربات", "مقبلات", "مشروبات"];

const FOOD_ITEMS = [
  {
    id: '1',
    name: 'جمبري مشوي',
    category: 'مأكولات بحرية',
    price: 150,
    description: 'جمبري طازج مشوي مع صلصة الليمون والأعشاب.',
    ingredients: 'جمبري، ليمون، ثوم، بقدونس',
    rating: 4.5,
    reviews: [{ user: 'أحمد', comment: 'طعم رائع!' }]
  },
  {
    id: '2',
    name: 'برجر دجاج',
    category: 'ساندويشات',
    price: 45,
    description: 'ساندويش برجر دجاج مقرمش مع الجبنة.',
    ingredients: 'خبز، دجاج، خس، جبنة شيدر',
    rating: 4.0,
    reviews: []
  },
  {
    id: '3',
    name: 'ستيك لحم',
    category: 'أطباق رئيسية',
    price: 200,
    description: 'قطعة ستيك ريب آي بصوص المشروم.',
    ingredients: 'لحم بقري، مشروم، كريمة',
    rating: 4.8,
    reviews: []
  },
  {
    id: '4',
    name: 'شوربة عدس',
    category: 'شوربات',
    price: 25,
    description: 'شوربة عدس ساخنة مع الخبز المحمص.',
    ingredients: 'عدس، جزر، بصل',
    rating: 4.2,
    reviews: []
  },
];

// --- 2. إدارة الحالة (Context) للسلة ---
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) => 
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, qty: 1 }];
      }
    });
    Alert.alert("نجاح", "تمت إضافة الصنف للسلة");
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// --- 3. الشاشات (Screens) ---

// شاشة تسجيل الدخول
const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      <TextInput 
        placeholder="البريد الإلكتروني" 
        style={styles.input} 
        placeholderTextColor="#999"
      />
      <TextInput 
        placeholder="كلمة المرور" 
        secureTextEntry={true} // تعديل: كتابة القيمة صريحة
        style={styles.input} 
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Home')}>
        <Text style={styles.btnText}>دخول</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>ليس لديك حساب؟ اشترك الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

// شاشة الاشتراك
const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      <TextInput placeholder="الاسم الكامل" style={styles.input} placeholderTextColor="#999"/>
      <TextInput placeholder="البريد الإلكتروني" style={styles.input} placeholderTextColor="#999"/>
      <TextInput 
        placeholder="كلمة المرور" 
        secureTextEntry={true} // تعديل: كتابة القيمة صريحة
        style={styles.input} 
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Home')}>
        <Text style={styles.btnText}>تسجيل</Text>
      </TouchableOpacity>
    </View>
  );
};

// الصفحة الرئيسية
const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const { cart } = useContext(CartContext);

  const filteredItems = selectedCategory === "الكل" 
    ? FOOD_ITEMS 
    : FOOD_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>قائمة الطعام</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart" size={28} color="#e67e22" />
          <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
        </TouchableOpacity>
      </View>

      {/* أقسام الطعام */}
      <View style={{ height: 60 }}>
        <ScrollView 
          horizontal={true} // تعديل: كتابة القيمة صريحة
          showsHorizontalScrollIndicator={false} 
          style={styles.catScroll}
        >
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.catItem, selectedCategory === cat && styles.catItemActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* قائمة الأصناف */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.foodCard} 
            onPress={() => navigation.navigate('Details', { item })}
          >
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodCat}>{item.category}</Text>
              <Text style={styles.foodPrice}>{item.price} ر.س</Text>
            </View>
            <Ionicons name="chevron-back" size={24} color="#ccc" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

// تفاصيل الصنف
const DetailsScreen = ({ route }) => {
  const { item } = route.params;
  const { addToCart } = useContext(CartContext);
  
  const [reviews, setReviews] = useState(item.reviews || []);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleAddReview = () => {
    if(!newComment) return;
    const review = { user: 'أنا', comment: newComment, stars: rating };
    setReviews([...reviews, review]);
    setNewComment("");
    Alert.alert("شكراً", "تم إضافة تعليقك");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagePlaceholder}>
          <Ionicons name="fast-food" size={80} color="#ddd" />
      </View>
      
      <View style={styles.detailBox}>
        <Text style={styles.detailTitle}>{item.name}</Text>
        <Text style={styles.detailPrice}>{item.price} ر.س</Text>
        <Text style={styles.sectionHeader}>المكونات والوصف:</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.desc}>المكونات: {item.ingredients}</Text>
        
        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
          <Text style={styles.addBtnText}>إضافة للسلة</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewBox}>
        <Text style={styles.sectionHeader}>التقييمات والتعليقات</Text>
        
        <View style={styles.addReviewSection}>
            <TextInput 
              placeholder="أكتب تعليقك..." 
              style={styles.reviewInput} 
              value={newComment}
              onChangeText={setNewComment}
              placeholderTextColor="#999"
            />
            <View style={{flexDirection:'row', marginBottom: 10}}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                   <Ionicons name={star <= rating ? "star" : "star-outline"} size={24} color="#f1c40f" />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.smallBtn} onPress={handleAddReview}>
              <Text style={styles.smallBtnText}>نشر التعليق</Text>
            </TouchableOpacity>
        </View>

        {reviews.map((rev, index) => (
          <View key={index} style={styles.reviewItem}>
            <Text style={{fontWeight:'bold'}}>{rev.user}</Text>
            <Text>{rev.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// السلة والدفع
const CartScreen = ({ navigation }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('cash'); 

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    Alert.alert(
      "تأكيد الطلب",
      `المجموع: ${total} ر.س \n طريقة الدفع: ${paymentMethod === 'cash' ? 'كاش' : 'فيزا'}`,
      [
        { text: "إلغاء", style: "cancel" },
        { text: "تأكيد", onPress: () => {
            clearCart();
            Alert.alert("تم الطلب بنجاح!");
            navigation.navigate('Home');
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={item => item.id + Math.random()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.cartName}>{item.name} (x{item.qty})</Text>
            <Text style={styles.cartPrice}>{item.price * item.qty} ر.س</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 20}}>السلة فارغة</Text>}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>الإجمالي: {total} ر.س</Text>
          
          <Text style={{marginTop: 10, fontWeight:'bold'}}>اختر طريقة الدفع:</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity 
              style={[styles.payBtn, paymentMethod === 'cash' && styles.payBtnActive]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text style={paymentMethod === 'cash' ? {color:'#fff'} : {color:'#000'}}>كاش 💵</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.payBtn, paymentMethod === 'visa' && styles.payBtnActive]}
              onPress={() => setPaymentMethod('visa')}
            >
              <Text style={paymentMethod === 'visa' ? {color:'#fff'} : {color:'#000'}}>فيزا 💳</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>إتمام الطلب</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- 4. إعداد التنقل (Navigation Setup) ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: '#f5f5f5'} }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{headerShown: true, title:'تفاصيل الوجبة'}} />
          <Stack.Screen name="Cart" component={CartScreen} options={{headerShown: true, title:'سلة المشتريات'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

// --- 5. التنسيق (Styles) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 40 },
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#e67e22', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 15, textAlign: 'center', color: '#e67e22' },
  
  // Home Styles
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  badge: { position: 'absolute', right: -5, top: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  catScroll: { paddingLeft: 10, marginBottom: 10 },
  catItem: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#ddd', borderRadius: 20, marginRight: 10, height: 40 },
  catItemActive: { backgroundColor: '#e67e22' },
  catText: { color: '#333' },
  catTextActive: { color: '#fff', fontWeight: 'bold' },
  foodCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 15, alignItems: 'center', elevation: 2 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: 'bold' },
  foodCat: { color: '#777', fontSize: 12 },
  foodPrice: { color: '#e67e22', fontWeight: 'bold', marginTop: 5 },

  // Details Styles
  imagePlaceholder: { height: 200, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginBottom: 15},
  detailBox: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20 },
  detailTitle: { fontSize: 24, fontWeight: 'bold' },
  detailPrice: { fontSize: 20, color: '#e67e22', marginBottom: 10 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  desc: { color: '#555', lineHeight: 22 },
  addBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  reviewBox: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 50 },
  reviewInput: { borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 10, paddingVertical: 5 },
  smallBtn: { backgroundColor: '#3498db', padding: 10, borderRadius: 5, alignItems: 'center' },
  smallBtnText: { color: '#fff' },
  reviewItem: { marginTop: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },

  // Cart Styles
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 10 },
  cartName: { fontSize: 16 },
  cartPrice: { fontWeight: 'bold', color: '#e67e22' },
  footer: { marginTop: 'auto', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  totalText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  paymentMethods: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  payBtn: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, width: '45%', alignItems: 'center' },
  payBtnActive: { backgroundColor: '#e67e22', borderColor: '#e67e22' },
  checkoutBtn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});