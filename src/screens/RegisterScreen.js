import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react'; // 1. Importar useRef
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    
    const { signIn } = useAuth();

    // 2. Criar as referências para cada TextInput
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        
        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Digite um e-mail válido (ex: nome@email.com).';
            isValid = false;
        }

        if (password.length < 6) {
            newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = () => {
        if (validate()) {
            setIsSuccess(true);
            setTimeout(() => {
                signIn({ name, email });
            }, 2500);
        }
    };

    if (isSuccess) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="checkmark-circle" size={100} color="#4CD964" />
                <Text style={[styles.title, { marginTop: 20 }]}>Cadastro Concluído!</Text>
                <Text style={[styles.subtitle, { marginBottom: 30 }]}>
                    Sua conta foi criada com sucesso.
                    {'\n'}Entrando no app...
                </Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => signIn({ name, email })}
                >
                    <Text style={styles.buttonText}>ENTRAR AGORA</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

            {/* Input Nome: Ao enviar, foca no Email */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nome Completo"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors(prev => ({...prev, name: null}));
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current.focus()} // 4. Foca no próximo
                        blurOnSubmit={false}
                    />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Input Email: Ao enviar, foca na Senha */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        ref={emailRef} // 3. Anexa a ref
                        style={styles.input}
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors(prev => ({...prev, email: null}));
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current.focus()} // 4. Foca no próximo
                        blurOnSubmit={false}
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Input Senha: Ao enviar, foca na Confirmação */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        ref={passwordRef} // 3. Anexa a ref
                        style={styles.input}
                        placeholder="Senha"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors(prev => ({...prev, password: null}));
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current.focus()} // 4. Foca no próximo
                        blurOnSubmit={false}
                    />
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Input Confirmar Senha: Ao enviar, dispara o Registro */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        ref={confirmPasswordRef} // 3. Anexa a ref
                        style={styles.input}
                        placeholder="Confirmar Senha"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setErrors(prev => ({...prev, confirmPassword: null}));
                        }}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister} // Dispara a função final
                    />
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>CADASTRAR</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.bold}>Faça Login</Text></Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        maxWidth: Platform.OS === 'web' ? 500 : '100%',
        width: '100%',
        alignSelf: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    fieldWrapper: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF0F0',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#333',
        outlineStyle: 'none', 
    },
    button: {
        backgroundColor: '#4A90E2',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
    },
    linkText: {
        color: '#666',
        fontSize: 14,
    },
    bold: {
        color: '#4A90E2',
        fontWeight: 'bold',
    },
});