export const resources = {
    en: {
        translation: {
            tabs: {
                home: "Home",
                deck: "Deck",
                notes: "Notes",
                settings: "Settings",
                analytics: "Analytics"
            },
            settings: {
                title: "Settings",
                preferences: "Preferences",
                language: "Language",
                notifications: "Notifications",
                widget: "Widget",
                configure: "Configure",
                appearance: "Appearance",
                customizeLook: "Customize Look",
                textSize: "Text Size",
                theme: "Theme",
                about: "About",
                privacy: "Privacy Policy",
                selectTheme: "Select Theme",
                selectLanguage: "Select Language",
                share: "Share App",
                shareMessage: "Check out Tarot Card of the Day! 🔮",
                appInfo: "App Info",
                appDescription: "Tarot Card of the Day is your digital companion for daily spiritual guidance. Draw a daily card, reflect on its meaning, and track your spiritual journey. With support for multiple themes and languages, this app is designed to bring ancient wisdom into your modern life.",
                version: "Version",
                contactUs: "Contact Us",
                history: "My Journey",
                historySubtitle: "Reflect on your path",
                endOfHistory: "End of History",
                unlockPremium: "Unlock Premium",
                premiumDesc: "Remove ads & unlimited history",
                all: "All",
                major: "Major Arcana",
                minor: "Minor Arcana",
                otherApps: "Other Apps",
                notificationTime: "Notification Time",
                dailyReminder: "Daily Reminder",
                premiumActive: "Premium Active",
                premiumTitle: "Premium Feature",
                allFeaturesUnlocked: "All features unlocked",
                saved: "Preferences saved successfully.",
                dataManagement: "Data Management",
                backup: "Backup Data",
                restore: "Restore Data",
                backupShareTitle: "Save Backup File",
                sharingNotAvailable: "Sharing is not available on this device",
                backupError: "Failed to create backup",
                invalidBackupFile: "Invalid backup file",
                restoreSuccess: "Restored {{notes}} notes and {{history}} history entries!",
                restoreError: "Failed to restore backup",
                backupHelp: {
                    title: "Backup Guide",
                    intro: "You can move your data between devices using manual file export.",
                    exportTitle: "Export (Old Device)",
                    exportStep1: "Go to Settings > Backup Data",
                    exportStep2: "Save the file to your cloud (Drive/Files)",
                    exportStep3: "Send this file to your new device",
                    exportStep4: "Ensure the file ends in .json",
                    importTitle: "Import (New Device)",
                    importStep1: "Have the .json file ready on this device",
                    importStep2: "Go to Settings > Restore Data",
                    importStep3: "Select the file to restore"
                }
            },
            common: {
                success: "Success",
                error: "Error",
                saving: "Saving...",
                errorSave: "Failed to save settings.",
                cancel: "Cancel",
                ok: "OK",
                optimizing: "Optimizing your experience...",
                chooseLanguage: "Please choose your preferred language"
            },
            widget: {
                title: "Widget Setup",
                preview: "PREVIEW",
                howToAdd: "How to Add",
                troubleshooting: "Troubleshooting",
                forceUpdate: "Force Widget Update",
                forceUpdateDesc: "Tap this if the widget isn't showing the correct card.",
                step1: "Go to your Home Screen.",
                step2: "Long press on an empty space.",
                step3: "Select 'Widgets'.",
                step4: "Scroll to find 'Daily Tarot'.",
                step5: "Drag the widget to your screen.",
                step6: "Open the app to sync.",
                alertNoCard: "No Card",
                alertNoCardDesc: "You haven't drawn a card yet today!",
                alertSuccess: "Success",
                alertSuccessDesc: "Widget update requested!",
                alertError: "Error",
                alertErrorDesc: "Failed to sync widget.",
                light: "Light",
                dark: "Dark",
                transparency: "Transparency",
                showDate: "Show Date",
                showDateDesc: "Display current date on widget"
            },
            analytics: {
                title: "Soul Analytics",
                majorMinor: "Major vs Minor Arcana",
                major: "Major",
                minor: "Minor",
                focusMajor: "You are focusing on major life lessons.",
                focusMinor: "You are focusing on day-to-day matters.",
                elemental: "Elemental Balance",
                fire: "Fire",
                water: "Water",
                air: "Air",
                earth: "Earth",
                mostFrequent: "Most Frequent Card",
                drawnTimes: "Drawn {{count}} times",
                noData: "No Data Yet",
                noDataDesc: "Start your journey by drawing your first card.",
                lockDescription: "Unlock comprehensive Tarot analytics and discover deeper patterns in your spiritual journey.",
                streak: "Current Streak",
                days: "Days",
                activity: "Weekly Activity",
                numerology: "Numerology Insights",
                aces: "Aces",
                numbers: "Numbers (2-10)",
                court: "Court Cards"
            },
            notifications: {
                dailyTitle: "Your Daily Tarot Awaits 🔮",
                dailyBody: "Discover the wisdom the cards have for you today."
            },
            main: {
                title: "Tarot Card of the Day",
                tapToReveal: "Tap to Reveal",
                yourCard: "Your Card for Today",
                readMeaning: "Read Meaning",
                noCardDrawn: "No card drawn for this day.",
                askOracle: "Ask the Oracle"
            },
            chat: {
                title: "Tarot Coach AI",
                init: "I see you've drawn {{cardName}} today. What guidance do you seek regarding this card?",
                typing: "Oracle is thinking...",
                placeholder: "Ask anything...",
                fallback: "the cards",
                responses: [
                    "Reflecting on {{cardName}}, this suggests a need for balance.",
                    "That's a profound question. The cards indicate a hidden opportunity.",
                    "With {{cardName}}, trust your intuition on this matter.",
                    "The energy here is potent. Proceed with clarity."
                ],
                suggestions: {
                    general: "What is the main theme today?",
                    love: "How does this affect my love life?",
                    career: "What about my career?",
                    action: "What should I do?"
                },
                copy: "Copy",
                share: "Share",
                saveNote: "Save to Note",
                tip: "Tip: Long press a message to save or share",
                errorFallback: "The Oracle is meditating. Please try again."
            },
            appearance: {
                title: "Appearance",
                theme: "App Theme",
                themeSystem: "System Default",
                themeLight: "Light",
                themeDark: "Dark",
                textSize: "Text Size",
                textSmall: "Small",
                textMedium: "Medium (Default)",
                textLarge: "Large",
                cardStyle: "Card Style",
            },
            tags: {
                intuition: "Intuition",
                mystery: "Mystery",
            },



            // ... (Repeat for other languages with placeholders or machine translation)
            // For brevity, I will apply this pattern to 'ru', 'es', etc. assuming basic translation or placeholder.
            // Since I cannot do perfect translation for all without user input, I will use English for new keys in other langs 
            // OR make a best effort based on context.
            // ACTUALLY, I should probably just add the English keys to 'en' first, then mirror to others.
            // To be safe and fast, I'll add them to 'en' and 'ru' (since I see Russian context) and leave others as English-fallback or simple copy.

            date: {
                today: "Today",
                yesterday: "Yesterday"
            },
            card: {
                dailyWisdom: "Daily Wisdom",
                saveToJournal: "Save to Journal",
                general: "General Overview",
                love: "Love & Relationships",
                career: "Career & Work",
                finance: "Finance",
                health: "Health",
                spirituality: "Spirituality",
                advice: "Advice",
                personal: "Personal Condition",
                deep: "Deep Meaning",
                yes_no: "Yes / No",
                astrology: "Astrology",
                claim: "Affirmation",
                person: "As a Person",
                how_to_read: "How to Read",
                reversed: "Reversed Meaning",
                keywords: "Keywords",
                notes: "My Notes",
                numberOfNotes: "Number of Notes: "
            },
            themes: {
                dark: "Dusk (Dark)",
                light: "Dawn (Light)",
                ethereal: "Ethereal Garden"
            },
            languages: {
                en: "English",
                ru: "Russian",
                es: "Spanish",
                pt: "Portuguese",
                it: "Italian",
                fr: "French",
                de: "German",
                ja: "Japanese",
                pl: "Polish"
            },
            notes: {
                addNote: "Add Note",
                myNotes: "My Notes",
                noNotes: "No notes yet. Start writing...",
                save: "Save",
                delete: "Delete",
                edit: "Edit",
                byDate: "By Date",
                byCard: "By Card",
                deleteTitle: "Delete Note",
                deleteConfirm: "Are you sure you want to delete this note?",
                numberOfNotes: "Number of Notes: "
            },
            rate: {
                title: "Rate Us",
                message: "If you enjoy using Tarot Card of the Day, would you mind taking a moment to rate it? It won't take more than a minute. Thanks for your support!",
                yes: "Rate Now",
                later: "Remind Me Later",
                no: "No, Thanks"
            },
            paywall: {
                title: "Premium Access",
                restore: "Restore",
                hero: {
                    title_lines: "Deepen Your\nConnection",
                    subtitle: "Unlock the full potential of your daily readings with a single purchase."
                },
                features: {
                    oracle: { title: "Ask the Oracle", desc: "Get deeper insights with AI-powered answers." },
                    ads: { title: "Ad-Free Sanctuary", desc: "Focus on your ritual with zero distractions." },
                    history: { title: "Full History Access", desc: "View all past readings and trends." },
                    analytics: { title: "Advanced Analytics", desc: "Track your spiritual journey with charts." },
                    notes: { title: "Personal Notes", desc: "Journal your thoughts with every card." }
                },
                pricing: {
                    badge: "Best Value",
                    lifetime: "Lifetime Access"
                },
                cta: "Unlock Forever",
                links: {
                    privacy: "Privacy Policy",
                    terms: "Terms of Service"
                }
            },
            promo: {
                magicText: "To get more readings on different subjects please check our App ",
                magicLink: "Tarot Cards Magic",
                healingText: "Focus on daily tasks with ",
                healingLink: "Healing sounds App",
                astrologyText: "How stars are influencing your love today? Check ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Daily Reading",
                upright: "Upright • Reflection",
                reflection: "Reflection",
                reflectionQuestion: "What is this card trying to tell you today?",
                reflectionPrompt: "Take a moment to connect with the imagery. How does the energy of {{cardName}} resonate with your current situation?",
                placeholder: "Start writing your thoughts here...",
                saveEntry: "Save Entry"
            }
        }
    },
    ru: {
        translation: {
            tabs: {
                home: "Главная",
                deck: "Колода",
                notes: "Заметки",
                settings: "Настройки",
                analytics: "Аналитика"
            },
            settings: {
                title: "Настройки",
                preferences: "Предпочтения",
                language: "Язык",
                notifications: "Уведомления",
                widget: "Виджет",
                configure: "Настроить",
                appearance: "Внешний вид",
                customizeLook: "Настроить вид",
                textSize: "Размер текста",
                theme: "Тема",
                about: "О приложении",
                privacy: "Политика конфиденциальности",
                selectTheme: "Выберите тему",
                selectLanguage: "Выберите язык",
                share: "Поделиться",
                shareMessage: "Попробуй Таро Дня! 🔮",
                appInfo: "О приложении",
                appDescription: "Таро Дня — ваш цифровой спутник для ежедневного духовного руководства. Вытягивайте карту дня, размышляйте над ее значением и отслеживайте свой духовный путь. С поддержкой множества тем и языков, это приложение создано, чтобы принести древнюю мудрость в вашу современную жизнь.",
                version: "Версия",
                contactUs: "Связаться с нами",
                history: "Мой Путь",
                historySubtitle: "Размышляйте над своим путем",
                endOfHistory: "Конец истории",
                unlockPremium: "Разблокировать Премиум",
                premiumDesc: "Без рекламы и безлимитная история",
                all: "Все",
                major: "Старшие Арканы",
                minor: "Младшие Арканы",
                otherApps: "Другие приложения",
                notificationTime: "Время уведомлений",
                dailyReminder: "Ежедневное напоминание",
                premiumActive: "Премиум активен",
                premiumTitle: "Премиум функция",
                allFeaturesUnlocked: "Все функции разблокированы",
                saved: "Настройки успешно сохранены.",
                dataManagement: "Управление данными",
                backup: "Резервная копия",
                restore: "Восстановить",
                backupShareTitle: "Сохранить файл",
                sharingNotAvailable: "Обмен недоступен",
                backupError: "Ошибка создания копии",
                invalidBackupFile: "Неверный файл",
                restoreSuccess: "Восстановлено: заметки - {{notes}}, история - {{history}}!",
                restoreError: "Ошибка восстановления",
                backupHelp: {
                    title: "Гид по переносу",
                    intro: "Перенесите свои данные с помощью экспорта файла.",
                    exportTitle: "Экспорт (Старое устройство)",
                    exportStep1: "Настройки > Резервная копия",
                    exportStep2: "Сохраните файл в облако/на диск",
                    exportStep3: "Передайте файл на новое устройство",
                    exportStep4: "Убедитесь, что это .json файл",
                    importTitle: "Импорт (Новое устройство)",
                    importStep1: "Подготовьте файл на устройстве",
                    importStep2: "Настройки > Восстановить",
                    importStep3: "Выберите файл"
                }
            },
            common: {
                success: "Успех",
                error: "Ошибка",
                saving: "Сохранение...",
                errorSave: "Не удалось сохранить настройки.",
                cancel: "Отмена",
                optimizing: "Оптимизация вашего опыта...",
                chooseLanguage: "Пожалуйста, выберите предпочтительный язык"
            },
            widget: {
                title: "Настройка виджета",
                preview: "ПРЕДПРОСМОТР",
                howToAdd: "Как добавить",
                troubleshooting: "Устранение неполадок",
                forceUpdate: "Обновить виджет",
                forceUpdateDesc: "Нажмите, если виджет показывает не ту карту.",
                step1: "Перейдите на главный экран.",
                step2: "Удерживайте палец на пустом месте.",
                step3: "Выберите «Виджеты».",
                step4: "Найдите «Таро Дня».",
                step5: "Перетащите виджет на экран.",
                step6: "Откройте приложение для синхронизации.",
                alertNoCard: "Нет карты",
                alertNoCardDesc: "Вы еще не вытянули карту сегодня!",
                alertSuccess: "Успешно",
                alertSuccessDesc: "Запрос на обновление отправлен!",
                alertError: "Ошибка",
                alertErrorDesc: "Не удалось синхронизировать виджет.",
                light: "Светлая",
                dark: "Темная",
                transparency: "Прозрачность",
                showDate: "Показать дату",
                showDateDesc: "Показывать текущую дату на виджете"
            },
            analytics: {
                title: "Аналитика Души",
                majorMinor: "Старшие vs Младшие",
                major: "Старшие",
                minor: "Младшие",
                focusMajor: "Вы сосредоточены на важных уроках.",
                focusMinor: "Вы заняты повседневными деталями.",
                elemental: "Баланс Стихий",
                fire: "🔥 Огонь (Жезлы)",
                water: "💧 Вода (Чаши)",
                air: "💨 Воздух (Мечи)",
                earth: "🌍 Земля (Пентакли)",
                mostFrequent: "Частая карта",
                drawnTimes: "Выпала {{count}} раз(а)",
                noData: "Нет данных",
                noDataDesc: "Вытягивайте карту каждый день, чтобы увидеть статистику.",
                lockDescription: "Разблокируйте полную аналитику Таро и откройте глубокие закономерности вашего духовного пути.",
                streak: "Текущая серия",
                days: "Дней",
                activity: "Активность за неделю",
                numerology: "Нумерология",
                aces: "Тузы",
                numbers: "Числа (2-10)",
                court: "Придворные карты"
            },
            notifications: {
                dailyTitle: "Ваше Таро ждет 🔮",
                dailyBody: "Узнайте, какую мудрость карты приготовили для вас сегодня."
            },
            main: {
                title: "Карта Таро Дня",
                tapToReveal: "Нажмите, чтобы открыть",
                yourCard: "Ваша карта на сегодня",
                readMeaning: "Читать значение",
                noCardDrawn: "Карта не выбрана.",
                askOracle: "Спросить Оракул"
            },
            chat: {
                title: "Таро Коуч AI",
                init: "Вижу, что вам выпала карта {{cardName}}. Какое руководство вы ищете?",
                typing: "Оракул думает...",
                placeholder: "Спросите что угодно...",
                fallback: "карты",
                responses: [
                    "Размышляя над {{cardName}}, это указывает на необходимость баланса.",
                    "Это глубокий вопрос. Карты указывают на скрытую возможность.",
                    "С картой {{cardName}}, доверьтесь своей интуиции.",
                    "Энергия здесь мощная. Действуйте с ясностью."
                ],
                suggestions: {
                    general: "Какая главная тема сегодня?",
                    love: "Как это повлияет на любовь?",
                    career: "Что насчет карьеры?",
                    action: "Что мне делать?"
                },
                copy: "Копировать",
                share: "Поделиться",
                saveNote: "Сохранить в заметки",
                tip: "Совет: Удерживайте сообщение, чтобы сохранить или поделиться",
                errorFallback: "Оракул медитирует. Пожалуйста, попробуйте снова."
            },
            appearance: {
                title: "Внешний вид",
                theme: "Тема приложения",
                themeSystem: "Системная",
                themeLight: "Светлая",
                themeDark: "Темная",
                textSize: "Размер текста",
                textSmall: "Маленький",
                textMedium: "Средний (По умолчанию)",
                textLarge: "Большой",
            },
            tags: {
                intuition: "Интуиция",
                mystery: "Тайна",
            },

            date: {
                today: "Сегодня",
                yesterday: "Вчера"
            },
            card: {
                dailyWisdom: "Мудрость дня",
                saveToJournal: "Сохранить в журнал",
                general: "Общий обзор",
                love: "Любовь и отношения",
                career: "Карьера и работа",
                finance: "Деньги и финансы",
                health: "Здоровье",
                spirituality: "Духовность",
                advice: "Совет",
                personal: "Личное состояние",
                deep: "Глубокий смысл",
                yes_no: "Да / Нет",
                astrology: "Астрология",
                claim: "Утверждение",
                person: "Личность",
                how_to_read: "Как читать",
                reversed: "Перевернутое значение",
                keywords: "Ключевые слова",
                notes: "Мои заметки",
                numberOfNotes: "Количество заметок: "
            },
            themes: {
                dark: "Сумерки (Тёмная)",
                light: "Рассвет (Светлая)",
                ethereal: "Эфирный Сад"
            },
            languages: {
                en: "Английский",
                ru: "Русский",
                es: "Испанский",
                pt: "Португальский",
                it: "Итальянский",
                fr: "Французский",
                de: "Немецкий",
                ja: "Японский",
                pl: "Польский"
            },
            notes: {
                addNote: "Добавить заметку",
                myNotes: "Мои заметки",
                noNotes: "Нет заметок. Начните писать...",
                save: "Сохранить",
                delete: "Удалить",
                edit: "Изменить",
                byDate: "По дате",
                byCard: "По карте",
                deleteTitle: "Удалить заметку",
                deleteConfirm: "Вы уверены, что хотите удалить эту заметку?"
            },
            rate: {
                title: "Оцените нас",
                message: "Вам нравится приложение? Пожалуйста, оцените нас — это займет всего минуту. Спасибо за поддержку!",
                yes: "Оценить",
                later: "Напомнить позже",
                no: "Нет, спасибо"
            },
            paywall: {
                title: "Премиум доступ",
                restore: "Восстановить",
                hero: {
                    title_lines: "Углубите свою\nСвязь",
                    subtitle: "Раскройте полный потенциал ваших ежедневных чтений с одной покупкой."
                },
                features: {
                    oracle: { title: "Спросите Оракула", desc: "Получите более глубокие ответы с помощью ИИ." },
                    ads: { title: "Без рекламы", desc: "Сосредоточьтесь на ритуале без отвлекающих факторов." },
                    history: { title: "Полная история", desc: "Просматривайте все прошлые чтения и тренды." },
                    analytics: { title: "Продвинутая аналитика", desc: "Отслеживайте свой духовный путь с графиками." },
                    notes: { title: "Личные заметки", desc: "Записывайте мысли с каждой картой." }
                },
                pricing: {
                    badge: "Лучший выбор",
                    lifetime: "Пожизненный доступ"
                },
                cta: "Разблокировать навсегда",
                links: {
                    privacy: "Конфиденциальность",
                    terms: "Условия использования"
                }
            },
            promo: {
                magicText: "Чтобы получить больше раскладов, попробуйте наше приложение ",
                magicLink: "Магия Таро",
                healingText: "Сосредоточьтесь на задачах с приложением ",
                healingLink: "Исцеляющие Звуки",
                astrologyText: "Как звезды влияют на вашу любовь сегодня? Проверьте ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Ежедневное чтение",
                upright: "Прямое • Размышление",
                reflection: "Размышление",
                reflectionQuestion: "Что эта карта пытается сказать вам сегодня?",
                reflectionPrompt: "Найдите минутку, чтобы соединиться с образом. Как энергия {{cardName}} перекликается с вашей текущей ситуацией?",
                placeholder: "Начните писать свои мысли здесь...",
                saveEntry: "Сохранить запись"
            }
        }
    },
    es: {
        translation: {
            tabs: {
                home: "Inicio",
                deck: "Mazo",
                notes: "Notas",
                settings: "Ajustes",
                analytics: "Analítica"
            },
            settings: {
                title: "Ajustes",
                preferences: "Preferencias",
                language: "Idioma",
                notifications: "Notificaciones",
                widget: "Widget",
                configure: "Configurar",
                appearance: "Apariencia",
                customizeLook: "Personalizar Aspecto",
                textSize: "Tamaño del texto",
                theme: "Tema",
                about: "Acerca de",
                privacy: "Política de privacidad",
                selectTheme: "Seleccionar tema",
                selectLanguage: "Seleccionar idioma",
                share: "Compartir App",
                shareMessage: "¡Prueba Carta de Tarot del Día! 🔮",
                appInfo: "Info de la App",
                appDescription: "Carta de Tarot del Día es tu compañero digital para la guía espiritual diaria. Saca una carta diaria, reflexiona sobre su significado y sigue tu viaje espiritual. Diseñada con múltiples temas e idiomas, esta aplicación trae la sabiduría antigua a tu vida moderna.",
                version: "Versión",
                contactUs: "Contáctanos",
                history: "Mi Viaje",
                historySubtitle: "Reflexiona sobre tu camino",
                endOfHistory: "Fin de la historia",
                unlockPremium: "Desbloquear Premium",
                premiumDesc: "Sin anuncios e historial ilimitado",
                all: "Todos",
                major: "Arcanos Mayores",
                minor: "Arcanos Menores",
                premiumActive: "Premium Activo",
                premiumTitle: "Función Premium",
                allFeaturesUnlocked: "Todas las funciones desbloqueadas",
                saved: "Preferencias guardadas exitosamente.",
                dataManagement: "Gestión de Datos",
                backup: "Copia de Seguridad",
                restore: "Restaurar",
                backupShareTitle: "Guardar Archivo",
                sharingNotAvailable: "Compartir no disponible",
                backupError: "Error al crear copia",
                invalidBackupFile: "Archivo inválido",
                restoreSuccess: "¡Restaurado: {{notes}} notas, {{history}} entradas!",
                restoreError: "Error al restaurar",
                backupHelp: {
                    title: "Guía de Respaldo",
                    intro: "Mueve tus datos exportando un archivo manual.",
                    exportTitle: "Exportar (Viejo)",
                    exportStep1: "Ajustes > Copia de Seguridad",
                    exportStep2: "Guarda en la nube/archivos",
                    exportStep3: "Envía a tu nuevo dispositivo",
                    exportStep4: "Asegura formato .json",
                    importTitle: "Importar (Nuevo)",
                    importStep1: "Ten listo el archivo",
                    importStep2: "Ajustes > Restaurar",
                    importStep3: "Selecciona el archivo"
                }
            },
            common: {
                success: "Éxito",
                error: "Error",
                saving: "Guardando...",
                errorSave: "Error al guardar la configuración.",
                cancel: "Cancelar",
                optimizing: "Optimizando tu experiencia...",
                chooseLanguage: "Por favor, elige tu idioma preferido"
            },
            widget: {
                title: "Configuración del Widget",
                preview: "VISTA PREVIA",
                howToAdd: "Cómo añadir",
                troubleshooting: "Solución de problemas",
                forceUpdate: "Forzar actualización",
                forceUpdateDesc: "Toca aquí si el widget no muestra la carta correcta.",
                step1: "Ve a tu pantalla de inicio.",
                step2: "Mantén presionado en un espacio vacío.",
                step3: "Selecciona 'Widgets'.",
                step4: "Busca 'Daily Tarot'.",
                step5: "Arrastra el widget a tu pantalla.",
                step6: "Abre la aplicación para sincronizar.",
                alertNoCard: "Sin carta",
                alertNoCardDesc: "¡Aún no has sacado una carta hoy!",
                alertSuccess: "Éxito",
                alertSuccessDesc: "¡Actualización del widget solicitada!",
                alertError: "Error",
                alertErrorDesc: "Error al sincronizar el widget.",
                light: "Claro",
                dark: "Oscuro",
                transparency: "Transparencia",
                showDate: "Mostrar fecha",
                showDateDesc: "Mostrar fecha actual en el widget"
            },
            analytics: {
                title: "Análisis del Alma",
                majorMinor: "Arcanos Mayores vs Menores",
                major: "Mayores",
                minor: "Menores",
                focusMajor: "Te estás enfocando en lecciones de vida importantes.",
                focusMinor: "Te estás enfocando en asuntos cotidianos.",
                elemental: "Equilibrio Elemental",
                fire: "Fuego",
                water: "Agua",
                air: "Aire",
                earth: "Tierra",
                mostFrequent: "Carta más frecuente",
                drawnTimes: "Sacada {{count}} veces",
                noData: "Sin datos",
                noDataDesc: "Empieza tu viaje sacando tu primera carta.",
                lockDescription: "Desbloquea análisis completos de Tarot y descubre patrones más profundos en tu viaje espiritual.",
                streak: "Racha actual",
                days: "Días",
                activity: "Actividad semanal",
                numerology: "Numerología",
                aces: "Ases",
                numbers: "Números (2-10)",
                court: "Cartas de la Corte"
            },
            notifications: {
                dailyTitle: "Tu Tarot Diario te Espera 🔮",
                dailyBody: "Descubre la sabiduría que las cartas tienen para ti hoy."
            },
            main: {
                title: "Carta de Tarot del Día",
                tapToReveal: "Toca para revelar",
                yourCard: "Tu carta para hoy",
                readMeaning: "Leer significado",
                noCardDrawn: "Ninguna carta tirada por este día.",
                askOracle: "Pregunta al Oráculo"
            },
            chat: {
                title: "Coach de Tarot IA",
                init: "Veo que sacaste {{cardName}}. ¿Qué guía buscas?",
                typing: "El Oráculo está pensando...",
                placeholder: "Pregunta lo que quieras...",
                fallback: "las cartas",
                responses: [
                    "Reflexionando sobre {{cardName}}, esto sugiere una necesidad de equilibrio.",
                    "Esa es una pregunta profunda. Las cartas apuntan a una oportunidad oculta.",
                    "Con {{cardName}}, confía en tu intuición.",
                    "La energía aquí es potente. Procede con claridad."
                ],
                suggestions: {
                    general: "¿Cuál es el tema principal?",
                    love: "¿Cómo afecta esto al amor?",
                    career: "¿Qué hay de la carrera?",
                    action: "¿Qué debería hacer?"
                },
                copy: "Copiar",
                share: "Compartir",
                saveNote: "Guardar en nota",
                tip: "Consejo: Mantén presionado un mensaje para guardar o compartir",
                errorFallback: "El Oráculo está meditando. Por favor, inténtelo de nuevo."
            },
            appearance: {
                title: "Apariencia",
                theme: "Tema de la App",
                themeSystem: "Sistema",
                themeLight: "Claro",
                themeDark: "Oscuro",
                textSize: "Tamaño del texto",
                textSmall: "Pequeño",
                textMedium: "Medio (Por defecto)",
                textLarge: "Grande",
            },
            tags: {
                intuition: "Intuición",
                mystery: "Misterio",
            },
            date: {
                today: "Hoy",
                yesterday: "Ayer"
            },
            card: {
                dailyWisdom: "Sabiduría Diaria",
                saveToJournal: "Guardar en el diario",
                general: "Visión general",
                love: "Amor y relaciones",
                career: "Carrera y trabajo",
                finance: "Dinero y finanzas",
                health: "Salud",
                spirituality: "Espiritualidad",
                advice: "Consejo",
                personal: "Condición personal",
                deep: "Significado profundo",
                yes_no: "Sí / No",
                astrology: "Astrología",
                claim: "Afirmación",
                person: "Como persona",
                how_to_read: "Cómo leer",
                reversed: "Significado invertido",
                keywords: "Palabras clave",
                notes: "Mis Notas",
                numberOfNotes: "Número de notas: "
            },
            themes: {
                dark: "Crepúsculo (Oscuro)",
                light: "Amanecer (Claro)",
                ethereal: "Jardín Etéreo"
            },
            languages: {
                en: "Inglés",
                ru: "Ruso",
                es: "Español",
                pt: "Portugués",
                it: "Italiano",
                fr: "Francés",
                de: "Alemán",
                ja: "Japonés",
                pl: "Polaco"
            },
            notes: {
                addNote: "Añadir nota",
                myNotes: "Mis notas",
                noNotes: "No hay notas aún. Empieza a escribir...",
                save: "Guardar",
                delete: "Eliminar",
                edit: "Editar",
                deleteTitle: "Eliminar nota",
                deleteConfirm: "¿Estás seguro de que quieres eliminar esta nota?"
            },
            rate: {
                title: "Califícanos",
                message: "¿Te gusta la app? ¿Podrías dedicar un momento a calificarla? No te llevará más de un minuto. ¡Gracias por tu apoyo!",
                yes: "Calificar ahora",
                later: "Recordarme más tarde",
                no: "No, gracias"
            },
            paywall: {
                title: "Acceso Premium",
                restore: "Restaurar",
                hero: {
                    title_lines: "Profundiza tu\nConexión",
                    subtitle: "Desbloquea todo el potencial de tus lecturas diarias con una sola compra."
                },
                features: {
                    oracle: { title: "Pregunta al Oráculo", desc: "Obtén ideas más profundas con respuestas de IA." },
                    ads: { title: "Santuario sin anuncios", desc: "Concéntrate en tu ritual sin distracciones." },
                    history: { title: "Historial completo", desc: "Ver todas las lecturas pasadas y tendencias." },
                    analytics: { title: "Analítica avanzada", desc: "Rastrea tu viaje espiritual con gráficos." },
                    notes: { title: "Notas personales", desc: "Escribe tus pensamientos con cada carta." }
                },
                pricing: {
                    badge: "Mejor valor",
                    lifetime: "Acceso de por vida"
                },
                cta: "Desbloquear para siempre",
                links: {
                    privacy: "Privacidad",
                    terms: "Términos"
                }
            },
            promo: {
                magicText: "Para obtener más lecturas sobre diferentes temas, consulte nuestra App ",
                magicLink: "Tarot Cards Magic",
                healingText: "Concéntrate en las tareas diarias con ",
                healingLink: "Healing sounds App",
                astrologyText: "¿Cómo influyen las estrellas en tu amor hoy? Consulta ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Lectura Diaria",
                upright: "Vertical • Reflexión",
                reflection: "Reflexión",
                reflectionQuestion: "¿Qué intenta decirte esta carta hoy?",
                reflectionPrompt: "Tómate un momento para conectar con la imagen. ¿Cómo resuena la energía de {{cardName}} con tu situación actual?",
                placeholder: "Empieza a escribir tus pensamientos aquí...",
                saveEntry: "Guardar Entrada"
            }
        }
    },
    pt: {
        translation: {
            tabs: {
                home: "Início",
                deck: "Baralho",
                notes: "Notas",
                settings: "Configurações",
                analytics: "Analítica"
            },
            settings: {
                title: "Configurações",
                preferences: "Preferências",
                language: "Idioma",
                notifications: "Notificações",
                widget: "Widget",
                configure: "Configurar",
                appearance: "Aparência",
                textSize: "Tamanho do texto",
                theme: "Tema",
                about: "Sobre",
                privacy: "Política de privacidade",
                selectTheme: "Selecionar tema",
                selectLanguage: "Selecionar idioma",
                share: "Compartilhar App",
                shareMessage: "Confira a Carta de Tarot do Dia! 🔮",
                appInfo: "Info do App",
                appDescription: "Carta de Tarot do Dia é seu companheiro digital para orientação espiritual diária. Tire uma carta diária, reflita sobre seu significado e acompanhe sua jornada espiritual.",
                version: "Versão",
                contactUs: "Fale Conosco",
                history: "Minha Jornada",
                historySubtitle: "Reflita sobre seu caminho",
                endOfHistory: "Fim do histórico",
                unlockPremium: "Desbloquear Premium",
                premiumDesc: "Sem anúncios e histórico ilimitado",
                saved: "Preferências salvas com sucesso.",
                dataManagement: "Gerenciamento de Dados",
                backup: "Backup de Dados",
                restore: "Restaurar Dados",
                backupShareTitle: "Salvar Arquivo de Backup",
                sharingNotAvailable: "Compartilhamento indisponível",
                backupError: "Falha ao criar backup",
                invalidBackupFile: "Arquivo de backup inválido",
                restoreSuccess: "Restaurado: {{notes}} notas, {{history}} histórico!",
                restoreError: "Falha ao restaurar backup",
                backupHelp: {
                    title: "Guia de Backup",
                    intro: "Você pode mover seus dados exportando um arquivo manual.",
                    exportTitle: "Exportar (Antigo)",
                    exportStep1: "Configurações > Backup de Dados",
                    exportStep2: "Salve o arquivo na nuvem/arquivos",
                    exportStep3: "Envie para o novo dispositivo",
                    exportStep4: "Garanta que termine em .json",
                    importTitle: "Importar (Novo)",
                    importStep1: "Tenha o arquivo .json pronto",
                    importStep2: "Configurações > Restaurar Dados",
                    importStep3: "Selecione o arquivo"
                }
            },
            common: {
                success: "Sucesso",
                error: "Erro",
                saving: "Salvando...",
                errorSave: "Falha ao salvar configurações.",
                cancel: "Cancelar",
                ok: "OK",
                optimizing: "Otimizando sua experiência...",
                chooseLanguage: "Por favor, escolha seu idioma preferido"
            },
            widget: {
                title: "Configuração do Widget",
                preview: "PRÉVIA",
                howToAdd: "Como Adicionar",
                troubleshooting: "Solução de Problemas",
                forceUpdate: "Forçar Atualização",
                forceUpdateDesc: "Toque aqui se o widget não estiver mostrando a carta correta.",
                step1: "Vá para a Tela Inicial.",
                step2: "Pressione e segure em um espaço vazio.",
                step3: "Selecione 'Widgets'.",
                step4: "Role para encontrar 'Daily Tarot'.",
                step5: "Arraste o widget para sua tela.",
                step6: "Abra o aplicativo para sincronizar.",
                alertNoCard: "Sem Carta",
                alertNoCardDesc: "Você ainda não tirou uma carta hoje!",
                alertSuccess: "Sucesso",
                alertSuccessDesc: "Atualização do widget solicitada!",
                alertError: "Erro",
                alertErrorDesc: "Falha ao sincronizar widget.",
                light: "Claro",
                dark: "Escuro",
                transparency: "Transparência",
                showDate: "Mostrar Data",
                showDateDesc: "Exibir data atual no widget"
            },
            analytics: {
                title: "Analítica da Alma",
                majorMinor: "Arcanos Maiores vs Menores",
                major: "Maiores",
                minor: "Menores",
                focusMajor: "Você está focando em lições de vida importantes.",
                focusMinor: "Você está focando em questões do dia a dia.",
                elemental: "Equilíbrio Elemental",
                fire: "Fogo",
                water: "Água",
                air: "Ar",
                earth: "Terra",
                mostFrequent: "Carta Mais Frequente",
                drawnTimes: "Tirada {{count}} vezes",
                noData: "Sem Dados",
                noDataDesc: "Comece sua jornada tirando sua primeira carta.",
                lockDescription: "Desbloqueie análises completas de Tarot e descubra padrões mais profundos em sua jornada espiritual.",
                streak: "Sequência Atual",
                days: "Dias",
                activity: "Atividade Semanal",
                numerology: "Numerologia",
                aces: "Ases",
                numbers: "Números (2-10)",
                court: "Cartas da Corte"
            },
            notifications: {
                dailyTitle: "Seu Tarot Diário Aguarda 🔮",
                dailyBody: "Descubra a sabedoria que as cartas têm para você hoje."
            },
            main: {
                title: "Carta de Tarot do Dia",
                tapToReveal: "Toque para revelar",
                yourCard: "Sua carta para hoje",
                readMeaning: "Ler significado",
                noCardDrawn: "Nenhuma carta sorteada para este dia.",
                askOracle: "Pergunte ao Oráculo"
            },
            chat: {
                title: "Coach de Tarot IA",
                init: "Vejo que você tirou {{cardName}}. Que orientação você busca?",
                typing: "O Oráculo está pensando...",
                placeholder: "Pergunte qualquer coisa...",
                fallback: "as cartas",
                responses: [
                    "Refletindo sobre {{cardName}}, isso sugere uma necessidade de equilíbrio.",
                    "Essa é uma pergunta profunda. As cartas apontam para uma oportunidade oculta.",
                    "Com {{cardName}}, confie em sua intuição.",
                    "A energia aqui é potente. Prossiga com clareza."
                ],
                suggestions: {
                    general: "Qual é o tema principal?",
                    love: "Como isso afeta o amor?",
                    career: "E quanto à carreira?",
                    action: "O que devo fazer?"
                },
                copy: "Copiar",
                share: "Compartilhar",
                saveNote: "Salvar em nota",
                tip: "Dica: Pressione e segure uma mensagem para salvar ou compartilhar",
                errorFallback: "O Oráculo está meditando. Por favor, tente novamente."
            },
            appearance: {
                title: "Aparência",
                theme: "Tema do App",
                themeSystem: "Padrão do Sistema",
                themeLight: "Claro",
                themeDark: "Escuro",
                textSize: "Tamanho do Texto",
                textSmall: "Pequeno",
                textMedium: "Médio (Padrão)",
                textLarge: "Grande",
            },
            tags: {
                intuition: "Intuição",
                mystery: "Mistério",
            },
            date: {
                today: "Hoje",
                yesterday: "Ontem"
            },
            card: {
                dailyWisdom: "Sabedoria Diária",
                saveToJournal: "Salvar no diário",
                general: "Visão geral",
                love: "Amor e relacionamentos",
                career: "Carreira e trabalho",
                finance: "Dinheiro e finanças",
                health: "Saúde",
                spirituality: "Espiritualidade",
                advice: "Conselho",
                personal: "Condição pessoal",
                deep: "Significado profundo",
                yes_no: "Sim / Não",
                astrology: "Astrologia",
                claim: "Afirmação",
                person: "Como pessoa",
                how_to_read: "Como ler",
                reversed: "Significado invertido",
                keywords: "Palavras-chave",
                notes: "Minhas Notas",
                numberOfNotes: "Número de notas: "
            },
            themes: {
                dark: "Crepúsculo (Escuro)",
                light: "Amanhecer (Claro)",
                ethereal: "Jardim Etéreo"
            },
            languages: {
                en: "Inglês",
                ru: "Russo",
                es: "Espanhol",
                pt: "Português",
                it: "Italiano",
                fr: "Francês",
                de: "Alemão",
                ja: "Japonês",
                pl: "Polonês"
            },
            notes: {
                addNote: "Adicionar nota",
                myNotes: "Minhas notas",
                noNotes: "Não há notas ainda. Comece a escrever...",
                save: "Salvar",
                delete: "Excluir",
                edit: "Editar"
            },
            rate: {
                title: "Avalie-nos",
                message: "Você gosta do aplicativo? Importa-se de avaliá-lo? Não levará mais de um minuto. Obrigado pelo apoio!",
                yes: "Avaliar agora",
                later: "Lembrar mais tarde",
                no: "Não, obrigado"
            },
            paywall: {
                title: "Acesso Premium",
                restore: "Restaurar",
                hero: {
                    title_lines: "Aprofunde sua\nConexão",
                    subtitle: "Desbloqueie todo o potencial de suas leituras diárias com uma única compra."
                },
                features: {
                    oracle: { title: "Pergunte ao Oráculo", desc: "Obtenha insights mais profundos com respostas de IA." },
                    ads: { title: "Santuário sem anúncios", desc: "Concentre-se em seu ritual sem distrações." },
                    history: { title: "Histórico completo", desc: "Veja todas as leituras passadas e tendências." },
                    analytics: { title: "Análise avançada", desc: "Acompanhe sua jornada espiritual com gráficos." },
                    notes: { title: "Notas pessoais", desc: "Registre seus pensamentos com cada carta." }
                },
                pricing: {
                    badge: "Melhor valor",
                    lifetime: "Acesso vitalício"
                },
                cta: "Desbloquear para sempre",
                links: {
                    privacy: "Privacidade",
                    terms: "Termos"
                }
            },
            promo: {
                magicText: "Para obter mais leituras sobre diferentes assuntos, confira nosso App ",
                magicLink: "Tarot Cards Magic",
                healingText: "Concentre-se nas tarefas diárias com ",
                healingLink: "Healing sounds App",
                astrologyText: "Como as estrelas estão influenciando seu amor hoje? Confira ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Leitura Diária",
                upright: "Vertical • Reflexão",
                reflection: "Reflexão",
                reflectionQuestion: "O que esta carta está tentando te dizer hoje?",
                reflectionPrompt: "Tire um momento para se conectar com a imagem. Como a energia de {{cardName}} ressoa com sua situação atual?",
                placeholder: "Comece a escrever seus pensamentos aqui...",
                saveEntry: "Salvar Entrada"
            }
        }
    },
    it: {
        translation: {
            tabs: {
                home: "Home",
                deck: "Mazzo",
                notes: "Note",
                settings: "Impostazioni",
                analytics: "Analisi"
            },
            settings: {
                title: "Impostazioni",
                preferences: "Preferenze",
                language: "Lingua",
                notifications: "Notifiche",
                widget: "Widget",
                configure: "Configura",
                appearance: "Aspetto",
                textSize: "Dimensione testo",
                theme: "Tema",
                about: "Info",
                privacy: "Privacy Policy",
                selectTheme: "Seleziona tema",
                selectLanguage: "Seleziona lingua",
                share: "Condividi App",
                shareMessage: "Scopri Tarocchi del Giorno! 🔮",
                appInfo: "Info App",
                appDescription: "Tarocchi del Giorno è il tuo compagno digitale per la guida spirituale quotidiana. Estrai una carta giornaliera e rifletti sul suo significato.",
                version: "Versione",
                contactUs: "Contattaci",
                history: "Il Mio Viaggio",
                historySubtitle: "Rifletti sul tuo percorso",
                endOfHistory: "Fine della cronologia",
                unlockPremium: "Sblocca Premium",
                premiumDesc: "Rimuovi annunci e cronologia illimitata",
                saved: "Preferenze salvate con successo.",
                dataManagement: "Gestione Dati",
                backup: "Backup Dati",
                restore: "Ripristina Dati",
                backupShareTitle: "Salva File di Backup",
                sharingNotAvailable: "Condivisione non disponibile",
                backupError: "Impossibile creare backup",
                invalidBackupFile: "File non valido",
                restoreSuccess: "Ripristinato: {{notes}} note, {{history}} cronologia!",
                restoreError: "Impossibile ripristinare",
                backupHelp: {
                    title: "Guida al Backup",
                    intro: "Puoi spostare i tuoi dati esportando un file manuale.",
                    exportTitle: "Esporta (Vecchio)",
                    exportStep1: "Impostazioni > Backup Dati",
                    exportStep2: "Salva file su cloud/file",
                    exportStep3: "Invia al nuovo dispositivo",
                    exportStep4: "Assicurati che finisca in .json",
                    importTitle: "Importa (Nuovo)",
                    importStep1: "Prepara il file .json",
                    importStep2: "Impostazioni > Ripristina Dati",
                    importStep3: "Seleziona il file"
                }
            },
            common: {
                success: "Successo",
                error: "Errore",
                saving: "Salvataggio...",
                errorSave: "Impossibile salvare le impostazioni.",
                cancel: "Annulla",
                ok: "OK",
                optimizing: "Ottimizzazione della tua esperienza...",
                chooseLanguage: "Per favore, scegli la tua lingua preferita"
            },
            widget: {
                title: "Configurazione Widget",
                preview: "ANTEPRIMA",
                howToAdd: "Come Aggiungere",
                troubleshooting: "Risoluzione Problemi",
                forceUpdate: "Forza Aggiornamento",
                forceUpdateDesc: "Tocca qui se il widget non mostra la carta corretta.",
                step1: "Vai alla Home Screen.",
                step2: "Tieni premuto su uno spazio vuoto.",
                step3: "Seleziona 'Widget'.",
                step4: "Scorri fino a 'Daily Tarot'.",
                step5: "Trascina il widget sulla schermata.",
                step6: "Apri l'app per sincronizzare.",
                alertNoCard: "Nessuna Carta",
                alertNoCardDesc: "Non hai ancora estratto una carta oggi!",
                alertSuccess: "Successo",
                alertSuccessDesc: "Aggiornamento widget richiesto!",
                alertError: "Errore",
                alertErrorDesc: "Sincronizzazione widget fallita.",
                light: "Chiaro",
                dark: "Scuro",
                transparency: "Trasparenza",
                showDate: "Mostra Data",
                showDateDesc: "Mostra data corrente sul widget"
            },
            analytics: {
                title: "Analisi dell'Anima",
                majorMinor: "Arcani Maggiori vs Minori",
                major: "Maggiori",
                minor: "Minori",
                focusMajor: "Ti stai concentrando su lezioni di vita importanti.",
                focusMinor: "Ti stai concentrando su questioni quotidiane.",
                elemental: "Equilibrio Elementale",
                fire: "Fuoco",
                water: "Acqua",
                air: "Aria",
                earth: "Terra",
                mostFrequent: "Carta Più Frequente",
                drawnTimes: "Estratta {{count}} volte",
                noData: "Nessun Dato",
                noDataDesc: "Inizia il viaggio estraendo la tua prima carta.",
                lockDescription: "Sblocca analisi complete dei Tarocchi e scopri schemi più profondi nel tuo viaggio spirituale.",
                streak: "Serie Attuale",
                days: "Giorni",
                activity: "Attività Settimanale",
                numerology: "Approfondimenti Numerologia",
                aces: "Assi",
                numbers: "Numeri (2-10)",
                court: "Carte di Corte"
            },
            notifications: {
                dailyTitle: "Il Tuo Tarocco Quotidiano Ti Aspetta 🔮",
                dailyBody: "Scopri la saggezza che le carte hanno per te oggi."
            },
            main: {
                title: "Carta dei Tarocchi del Giorno",
                tapToReveal: "Tocca per rivelare",
                yourCard: "La tua carta per oggi",
                readMeaning: "Leggi significato",
                noCardDrawn: "Nessuna carta estratta per questo giorno.",
                askOracle: "Chiedi all'Oracolo"
            },
            chat: {
                title: "Coach Tarocchi IA",
                init: "Vedo che hai estratto {{cardName}}. Quale guida cerchi?",
                typing: "L'Oracolo sta pensando...",
                placeholder: "Chiedi qualsiasi cosa...",
                fallback: "le carte",
                responses: [
                    "Riflettendo su {{cardName}}, questo suggerisce un bisogno di equilibrio.",
                    "Questa è una domanda profonda. Le carte indicano un'opportunità nascosta.",
                    "Con {{cardName}}, fidati del tuo intuito.",
                    "L'energia qui è potente. Procedi con chiarezza."
                ],
                suggestions: {
                    general: "Qual è il tema principale?",
                    love: "Come influisce sull'amore?",
                    career: "E la carriera?",
                    action: "Cosa dovrei fare?"
                },
                copy: "Copia",
                share: "Condividi",
                saveNote: "Salva in nota",
                tip: "Suggerimento: tieni premuto un messaggio per salvare o condividere",
                errorFallback: "L'Oracolo sta meditando. Per favore riprova."
            },
            appearance: {
                title: "Aspetto",
                theme: "Tema App",
                themeSystem: "Predefinito di Sistema",
                themeLight: "Chiaro",
                themeDark: "Scuro",
                textSize: "Dimensione Testo",
                textSmall: "Piccolo",
                textMedium: "Medio (Predefinito)",
                textLarge: "Grande",
            },
            tags: {
                intuition: "Intuizione",
                mystery: "Mistero",
            },
            date: {
                today: "Oggi",
                yesterday: "Ieri"
            },
            card: {
                dailyWisdom: "Saggezza Quotidiana",
                saveToJournal: "Salva nel diario",
                general: "Panoramica generale",
                love: "Amore e relazioni",
                career: "Carriera e lavoro",
                finance: "Denaro e finanze",
                health: "Salute",
                spirituality: "Spiritualità",
                advice: "Consiglio",
                personal: "Condizione personale",
                deep: "Significato profondo",
                yes_no: "Sì / No",
                astrology: "Astrologia",
                claim: "Affermazione",
                person: "Come persona",
                how_to_read: "Come leggere",
                reversed: "Significato capovolto",
                keywords: "Parole chiave",
                notes: "Le mie note",
                numberOfNotes: "Numero di note: "
            },
            themes: {
                dark: "Crepuscolo (Scuro)",
                light: "Alba (Chiaro)",
                ethereal: "Giardino Etereo"
            },
            languages: {
                en: "Inglese",
                ru: "Russo",
                es: "Spagnolo",
                pt: "Portoghese",
                it: "Italiano",
                fr: "Francese",
                de: "Tedesco",
                ja: "Giapponese",
                pl: "Polacco"
            },
            notes: {
                addNote: "Aggiungi nota",
                myNotes: "Le mie note",
                noNotes: "Nessuna nota ancora. Inizia a scrivere...",
                save: "Salva",
                delete: "Elimina",
                edit: "Modifica"
            },
            rate: {
                title: "Valutaci",
                message: "Ti piace l'app? Potresti dedicarci un momento per valutarla? Grazie per il supporto!",
                yes: "Valuta ora",
                later: "Ricordamelo dopo",
                no: "No, grazie"
            },
            paywall: {
                title: "Accesso Premium",
                restore: "Ripristina",
                hero: {
                    title_lines: "Approfondisci la tua\nConnessione",
                    subtitle: "Sblocca tutto il potenziale delle tue letture quotidiane con un acquisto unico."
                },
                features: {
                    oracle: { title: "Chiedi all'Oracolo", desc: "Ottieni approfondimenti con risposte AI." },
                    ads: { title: "Santuario senza pubblicità", desc: "Concentrati sul tuo rituale senza distrazioni." },
                    history: { title: "Cronologia completa", desc: "Visualizza tutte le letture passate e le tendenze." },
                    analytics: { title: "Analisi avanzata", desc: "Traccia il tuo viaggio spirituale con grafici." },
                    notes: { title: "Note personali", desc: "Annota i tuoi pensieri con ogni carta." }
                },
                pricing: {
                    badge: "Miglior valore",
                    lifetime: "Accesso a vita"
                },
                cta: "Sblocca per sempre",
                links: {
                    privacy: "Privacy",
                    terms: "Termini"
                }
            },
            promo: {
                magicText: "Per ottenere più letture su diversi argomenti controlla la nostra App ",
                magicLink: "Tarot Cards Magic",
                healingText: "Concentrati sui compiti quotidiani con ",
                healingLink: "Healing sounds App",
                astrologyText: "Come le stelle influenzano il tuo amore oggi? Controlla ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Lettura Giornaliera",
                upright: "Dritto • Riflessione",
                reflection: "Riflessione",
                reflectionQuestion: "Cosa sta cercando di dirti questa carta oggi?",
                reflectionPrompt: "Prenditi un momento per connetterti con l'immagine. Come risuona l'energia di {{cardName}} con la tua situazione attuale?",
                placeholder: "Inizia a scrivere i tuoi pensieri qui...",
                saveEntry: "Salva Voce"
            }
        }
    },
    fr: {
        translation: {
            tabs: {
                home: "Accueil",
                deck: "Jeu",
                notes: "Notes",
                settings: "Paramètres",
                analytics: "Analyses"
            },
            settings: {
                title: "Paramètres",
                preferences: "Préférences",
                language: "Langue",
                notifications: "Notifications",
                widget: "Widget",
                configure: "Configurer",
                appearance: "Apparence",
                textSize: "Taille du texte",
                theme: "Thème",
                about: "À propos",
                privacy: "Politique de confidentialité",
                selectTheme: "Choisir un thème",
                selectLanguage: "Choisir la langue",
                share: "Partager l'application",
                shareMessage: "Découvrez Tarot du Jour ! 🔮",
                appInfo: "Info App",
                appDescription: "Tarot du Jour est votre compagnon numérique pour une guidance spirituelle quotidienne. Tirez une carte chaque jour et réfléchissez à sa signification.",
                version: "Version",
                contactUs: "Contactez-nous",
                history: "Mon Voyage",
                historySubtitle: "Réfléchissez à votre chemin",
                endOfHistory: "Fin de l'historique",
                unlockPremium: "Déverrouiller Premium",
                premiumDesc: "Supprimer les pubs et historique illimité",
                saved: "Préférences enregistrées avec succès.",
                dataManagement: "Gestion des Données",
                backup: "Sauvegarder",
                restore: "Restaurer",
                backupShareTitle: "Enregistrer le Fichier",
                sharingNotAvailable: "Partage non disponible",
                backupError: "Échec de la sauvegarde",
                invalidBackupFile: "Fichier invalide",
                restoreSuccess: "Restauré : {{notes}} notes, {{history}} historique !",
                restoreError: "Échec de la restauration",
                backupHelp: {
                    title: "Guide de Sauvegarde",
                    intro: "Déplacez vos données via un export de fichier manuel.",
                    exportTitle: "Exporter (Ancien)",
                    exportStep1: "Paramètres > Sauvegarder",
                    exportStep2: "Enregistrez sur le cloud/fichiers",
                    exportStep3: "Envoyez au nouvel appareil",
                    exportStep4: "Vérifiez que c'est un .json",
                    importTitle: "Importer (Nouveau)",
                    importStep1: "Ayez le fichier .json prêt",
                    importStep2: "Paramètres > Restaurer",
                    importStep3: "Sélectionnez le fichier"
                }
            },
            common: {
                success: "Succès",
                error: "Erreur",
                saving: "Enregistrement...",
                errorSave: "Échec de l'enregistrement des paramètres.",
                cancel: "Annuler",
                ok: "OK",
                optimizing: "Optimisation de votre expérience...",
                chooseLanguage: "Veuillez choisir votre langue préférée"
            },
            widget: {
                title: "Configuration Widget",
                preview: "APERÇU",
                howToAdd: "Comment Ajouter",
                troubleshooting: "Dépannage",
                forceUpdate: "Forcer Mise à Jour",
                forceUpdateDesc: "Appuyez ici si le widget n'affiche pas la bonne carte.",
                step1: "Allez sur votre écran d'accueil.",
                step2: "Appuyez longuement sur un espace vide.",
                step3: "Sélectionnez 'Widgets'.",
                step4: "Faites défiler pour trouver 'Daily Tarot'.",
                step5: "Faites glisser le widget sur votre écran.",
                step6: "Ouvrez l'application pour synchroniser.",
                alertNoCard: "Pas de Carte",
                alertNoCardDesc: "Vous n'avez pas encore tiré de carte aujourd'hui !",
                alertSuccess: "Succès",
                alertSuccessDesc: "Mise à jour du widget demandée !",
                alertError: "Erreur",
                alertErrorDesc: "Échec de la synchronisation.",
                light: "Clair",
                dark: "Sombre",
                transparency: "Transparence",
                showDate: "Afficher Date",
                showDateDesc: "Afficher la date actuelle sur le widget"
            },
            analytics: {
                title: "Analyse de l'Âme",
                majorMinor: "Arcanes Majeurs vs Mineurs",
                major: "Majeurs",
                minor: "Mineurs",
                focusMajor: "Vous vous concentrez sur des leçons de vie majeures.",
                focusMinor: "Vous vous concentrez sur des questions quotidiennes.",
                elemental: "Équilibre Élémentaire",
                fire: "Feu",
                water: "Eau",
                air: "Air",
                earth: "Terre",
                mostFrequent: "Carte la plus fréquente",
                drawnTimes: "Tirée {{count}} fois",
                noData: "Pas encore de données",
                noDataDesc: "Commencez votre voyage en tirant votre première carte.",
                lockDescription: "Débloquez des analyses complètes du Tarot et découvrez des schémas plus profonds dans votre voyage spirituel.",
                streak: "Série Actuelle",
                days: "Jours",
                activity: "Activité Hebdomadaire",
                numerology: "Aperçus Numérologie",
                aces: "As",
                numbers: "Nombres (2-10)",
                court: "Cartes de Cour"
            },
            notifications: {
                dailyTitle: "Votre Tarot Quotidien Attend 🔮",
                dailyBody: "Découvrez la sagesse que les cartes ont pour vous aujourd'hui."
            },
            main: {
                title: "Carte de Tarot du Jour",
                tapToReveal: "Appuyez pour révéler",
                yourCard: "Votre carte pour aujourd'hui",
                readMeaning: "Lire la signification",
                noCardDrawn: "Aucune carte tirée pour ce jour.",
                askOracle: "Demandez à l'Oracle"
            },
            chat: {
                title: "Coach Tarot IA",
                init: "Je vois que vous avez tiré {{cardName}}. Quelle guidance cherchez-vous ?",
                typing: "L'Oracle réfléchit...",
                placeholder: "Demandez n'importe quoi...",
                fallback: "les cartes",
                responses: [
                    "En réfléchissant à {{cardName}}, cela suggère un besoin d'équilibre.",
                    "C'est une question profonde. Les cartes indiquent une opportunité cachée.",
                    "Avec {{cardName}}, faites confiance à votre intuition.",
                    "L'énergie est puissante ici. C'est clair."
                ],
                suggestions: {
                    general: "Quel est le thème principal ?",
                    love: "Comment cela affecte-t-il l'amour ?",
                    career: "Quid de la carrière ?",
                    action: "Que dois-je faire ?"
                },
                copy: "Copier",
                share: "Partager",
                saveNote: "Enregistrer",
                tip: "Astuce : Appuyez longuement sur un message pour enregistrer ou partager",
                errorFallback: "L'Oracle médite. Veuillez réessayer."
            },
            appearance: {
                title: "Apparence",
                theme: "Thème App",
                themeSystem: "Défaut Système",
                themeLight: "Clair",
                themeDark: "Sombre",
                textSize: "Taille Texte",
                textSmall: "Petit",
                textMedium: "Moyen (Défaut)",
                textLarge: "Grand",
            },
            tags: {
                intuition: "Intuition",
                mystery: "Mystère",
            },
            date: {
                today: "Aujourd'hui",
                yesterday: "Hier"
            },
            card: {
                dailyWisdom: "Sagesse Quotidienne",
                saveToJournal: "Enregistrer dans le journal",
                general: "Vue d'ensemble",
                love: "Amour et relations",
                career: "Carrière et travail",
                finance: "Argent et finances",
                health: "Santé",
                spirituality: "Spiritualité",
                advice: "Conseil",
                personal: "État personnel",
                deep: "Sens profond",
                yes_no: "Oui / Non",
                astrology: "Astrologie",
                claim: "Affirmation",
                person: "En tant que personne",
                how_to_read: "Comment lire",
                reversed: "Signification inversée",
                keywords: "Mots-clés",
                notes: "Mes Notes",
                numberOfNotes: "Nombre de notes : "
            },
            themes: {
                dark: "Crépuscule (Sombre)",
                light: "Aube (Clair)",
                ethereal: "Jardin Éthéré"
            },
            languages: {
                en: "Anglais",
                ru: "Russe",
                es: "Espagnol",
                pt: "Portugais",
                it: "Italien",
                fr: "Français",
                de: "Allemand",
                ja: "Japonais",
                pl: "Polonais"
            },
            notes: {
                addNote: "Ajouter une note",
                myNotes: "Mes notes",
                noNotes: "Pas encore de notes. Commencez à écrire...",
                save: "Enregistrer",
                delete: "Supprimer",
                edit: "Modifier"
            },
            rate: {
                title: "Notez-nous",
                message: "Vous aimez l'application ? Pourriez-vous prendre un instant pour la noter ? Merci de votre soutien !",
                yes: "Noter maintenant",
                later: "Rappeler plus tard",
                no: "Non, merci"
            },
            paywall: {
                title: "Accès Premium",
                restore: "Restaurer",
                hero: {
                    title_lines: "Approfondissez votre\nConnexion",
                    subtitle: "Libérez tout le potentiel de vos lectures quotidiennes avec un achat unique."
                },
                features: {
                    oracle: { title: "Demandez à l'Oracle", desc: "Obtenez des réponses plus profondes grâce à l'IA." },
                    ads: { title: "Sanctuaire sans publicité", desc: "Concentrez-vous sur votre rituel sans distractions." },
                    history: { title: "Historique complet", desc: "Voir toutes les lectures passées et les tendances." },
                    analytics: { title: "Analyses avancées", desc: "Suivez votre voyage spirituel avec des graphiques." },
                    notes: { title: "Notes personnelles", desc: "Journalisez vos pensées avec chaque carte." }
                },
                pricing: {
                    badge: "Meilleure valeur",
                    lifetime: "Accès à vie"
                },
                cta: "Débloquer pour toujours",
                links: {
                    privacy: "Confidentialité",
                    terms: "Conditions"
                }
            },
            promo: {
                magicText: "Pour obtenir plus de lectures sur différents sujets, consultez notre App ",
                magicLink: "Tarot Cards Magic",
                healingText: "Concentrez-vous sur les tâches quotidiennes avec ",
                healingLink: "Healing sounds App",
                astrologyText: "Comment les étoiles influencent-elles votre amour aujourd'hui ? Consultez ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Lecture Quotidienne",
                upright: "Droit • Réflexion",
                reflection: "Réflexion",
                reflectionQuestion: "Qu'est-ce que cette carte essaie de vous dire aujourd'hui ?",
                reflectionPrompt: "Prenez un moment pour vous connecter à l'imagerie. Comment l'énergie de {{cardName}} résonne-t-elle avec votre situation actuelle ?",
                placeholder: "Commencez à écrire vos pensées ici...",
                saveEntry: "Enregistrer Entrée"
            }
        }
    },
    de: {
        translation: {
            tabs: {
                home: "Start",
                deck: "Deck",
                notes: "Notizen",
                settings: "Einstellungen",
                analytics: "Analysen"
            },
            settings: {
                title: "Einstellungen",
                preferences: "Präferenzen",
                language: "Sprache",
                notifications: "Benachrichtigungen",
                widget: "Widget",
                configure: "Konfigurieren",
                appearance: "Aussehen",
                textSize: "Textgröße",
                theme: "Thema",
                about: "Über",
                privacy: "Datenschutz",
                selectTheme: "Thema wählen",
                selectLanguage: "Sprache wählen",
                share: "App teilen",
                shareMessage: "Schau dir Tages-Tarot an! 🔮",
                appInfo: "App Info",
                appDescription: "Tages-Tarot ist dein digitaler Begleiter für tägliche spirituelle Führung. Ziehe eine Tageskarte und reflektiere über ihre Bedeutung.",
                version: "Version",
                contactUs: "Kontaktiere uns",
                history: "Meine Reise",
                historySubtitle: "Reflektiere über deinen Weg",
                endOfHistory: "Ende des Verlaufs",
                unlockPremium: "Premium freischalten",
                premiumDesc: "Keine Werbung & unbegrenzter Verlauf",
                saved: "Einstellungen erfolgreich gespeichert.",
                dataManagement: "Datenverwaltung",
                backup: "Daten Sichern",
                restore: "Daten Wiederherstellen",
                backupShareTitle: "Backup-Datei Speichern",
                sharingNotAvailable: "Teilen nicht verfügbar",
                backupError: "Backup fehlgeschlagen",
                invalidBackupFile: "Ungültige Datei",
                restoreSuccess: "Wiederhergestellt: {{notes}} Notizen, {{history}} Verlauf!",
                restoreError: "Wiederherstellung fehlgeschlagen",
                backupHelp: {
                    title: "Backup Anleitung",
                    intro: "Sie können Ihre Daten durch manuellen Dateiexport verschieben.",
                    exportTitle: "Exportieren (Alt)",
                    exportStep1: "Einstellungen > Daten Sichern",
                    exportStep2: "Datei in Cloud/Dateien speichern",
                    exportStep3: "An neues Gerät senden",
                    exportStep4: "Muss auf .json enden",
                    importTitle: "Importieren (Neu)",
                    importStep1: "Halten Sie die .json Datei bereit",
                    importStep2: "Einstellungen > Wiederherstellen",
                    importStep3: "Datei auswählen"
                }
            },
            common: {
                success: "Erfolg",
                error: "Fehler",
                saving: "Speichern...",
                errorSave: "Einstellungen konnten nicht gespeichert werden.",
                cancel: "Abbrechen",
                ok: "OK",
                optimizing: "Optimierung Ihres Erlebnisses...",
                chooseLanguage: "Bitte wählen Sie Ihre bevorzugte Sprache"
            },
            widget: {
                title: "Widget-Einrichtung",
                preview: "VORSCHAU",
                howToAdd: "Hinzufügen",
                troubleshooting: "Fehlerbehebung",
                forceUpdate: "Widget-Update erzwingen",
                forceUpdateDesc: "Tippen Sie hier, wenn das Widget nicht die richtige Karte anzeigt.",
                step1: "Gehen Sie zu Ihrem Startbildschirm.",
                step2: "Drücken Sie lange auf einen leeren Bereich.",
                step3: "Wählen Sie 'Widgets'.",
                step4: "Scrollen Sie zu 'Daily Tarot'.",
                step5: "Ziehen Sie das Widget auf Ihren Bildschirm.",
                step6: "Öffne die App zum Synchronisieren.",
                alertNoCard: "Keine Karte",
                alertNoCardDesc: "Sie haben heute noch keine Karte gezogen!",
                alertSuccess: "Erfolg",
                alertSuccessDesc: "Widget-Update angefordert!",
                alertError: "Fehler",
                alertErrorDesc: "Widget-Synchronisierung fehlgeschlagen.",
                light: "Hell",
                dark: "Dunkel",
                transparency: "Transparenz",
                showDate: "Datum anzeigen",
                showDateDesc: "Aktuelles Datum im Widget anzeigen"
            },
            analytics: {
                title: "Seelen-Analyse",
                majorMinor: "Große vs. Kleine Arkana",
                major: "Große",
                minor: "Kleine",
                focusMajor: "Sie konzentrieren sich auf große Lebenslektionen.",
                focusMinor: "Sie konzentrieren sich auf alltägliche Dinge.",
                elemental: "Elementares Gleichgewicht",
                fire: "Feuer",
                water: "Wasser",
                air: "Luft",
                earth: "Erde",
                mostFrequent: "Häufigste Karte",
                drawnTimes: "{{count}} mal gezogen",
                noData: "Noch keine Daten",
                noDataDesc: "Beginnen Sie Ihre Reise, indem Sie Ihre erste Karte ziehen.",
                lockDescription: "Schalten Sie umfassende Tarot-Analysen frei und entdecken Sie tiefere Muster auf Ihrer spirituellen Reise.",
                streak: "Aktuelle Serie",
                days: "Tage",
                activity: "Wöchentliche Aktivität",
                numerology: "Numerologie-Einblicke",
                aces: "Asse",
                numbers: "Zahlen (2-10)",
                court: "Hofkarten"
            },
            notifications: {
                dailyTitle: "Dein Tages-Tarot erwartet dich 🔮",
                dailyBody: "Entdecke die Weisheit, die die Karten heute für dich bereithalten."
            },
            main: {
                title: "Tarotkarte des Tages",
                tapToReveal: "Tippen zum Aufdecken",
                yourCard: "Deine Karte für heute",
                readMeaning: "Bedeutung lesen",
                noCardDrawn: "Keine Karte für diesen Tag gezogen.",
                askOracle: "Frag das Orakel"
            },
            chat: {
                title: "Tarot Coach KI",
                init: "Ich sehe, du hast {{cardName}} gezogen. Welche Führung suchst du?",
                typing: "Das Orakel denkt nach...",
                placeholder: "Frag alles...",
                fallback: "die Karten",
                responses: [
                    "Wenn ich über {{cardName}} nachdenke, deutet das auf ein Bedürfnis nach Balance hin.",
                    "Das ist eine tiefgründige Frage. Die Karten weisen auf eine verborgene Chance hin.",
                    "Mit {{cardName}}, vertraue deiner Intuition.",
                    "Die Energie hier ist stark. Gehe mit Klarheit vor."
                ],
                suggestions: {
                    general: "Was ist das Hauptthema?",
                    love: "Wie wirkt sich das auf die Liebe aus?",
                    career: "Was ist mit der Karriere?",
                    action: "Was soll ich tun?"
                },
                copy: "Kopieren",
                share: "Teilen",
                saveNote: "Notiz speichern",
                tip: "Tipp: Nachricht lange drücken zum Speichern oder Teilen",
                errorFallback: "Das Orakel meditiert. Bitte versuchen Sie es erneut."
            },
            appearance: {
                title: "Aussehen",
                theme: "App-Thema",
                themeSystem: "Systemstandard",
                themeLight: "Hell",
                themeDark: "Dunkel",
                textSize: "Textgröße",
                textSmall: "Klein",
                textMedium: "Mittel (Standard)",
                textLarge: "Groß",
            },
            tags: {
                intuition: "Intuition",
                mystery: "Mysterium",
            },
            date: {
                today: "Heute",
                yesterday: "Gestern"
            },
            card: {
                dailyWisdom: "Tägliche Weisheit",
                saveToJournal: "Im Tagebuch speichern",
                general: "Allgemeiner Überblick",
                love: "Liebe & Beziehungen",
                career: "Karriere & Arbeit",
                finance: "Geld & Finanzen",
                health: "Gesundheit",
                spirituality: "Spiritualität",
                advice: "Rat",
                personal: "Persönlicher Zustand",
                deep: "Tiefe Bedeutung",
                yes_no: "Ja / Nein",
                astrology: "Astrologie",
                claim: "Affirmation",
                person: "Als Person",
                how_to_read: "Wie zu lesen",
                reversed: "Umgekehrte Bedeutung",
                keywords: "Schlüsselwörter",
                notes: "Meine Notizen",
                numberOfNotes: "Anzahl der Notizen: "
            },
            themes: {
                dark: "Dämmerung (Dunkel)",
                light: "Morgendämmerung (Hell)",
                ethereal: "Ätherischer Garten"
            },
            languages: {
                en: "Englisch",
                ru: "Russisch",
                es: "Spanisch",
                pt: "Portugiesisch",
                it: "Italienisch",
                fr: "Französisch",
                de: "Deutsch",
                ja: "Japanisch",
                pl: "Polnisch"
            },
            notes: {
                addNote: "Notiz hinzufügen",
                myNotes: "Meine Notizen",
                noNotes: "Noch keine Notizen. Fange an zu schreiben...",
                save: "Speichern",
                delete: "Löschen",
                edit: "Bearbeiten"
            },
            rate: {
                title: "Bewerte uns",
                message: "Gefällt dir die App? Würdest du sie kurz bewerten? Danke für deine Unterstützung!",
                yes: "Jetzt bewerten",
                later: "Später erinnern",
                no: "Nein, danke"
            },
            paywall: {
                title: "Premium Zugang",
                restore: "Wiederherstellen",
                hero: {
                    title_lines: "Vertiefe deine\nVerbindung",
                    subtitle: "Entsperre das volle Potenzial deiner täglichen Lesungen mit einem einzigen Kauf."
                },
                features: {
                    oracle: { title: "Frag das Orakel", desc: "Erhalte tiefere Einblicke mit KI-Antworten." },
                    ads: { title: "Werbefreie Zuflucht", desc: "Konzentriere dich ohne Ablenkungen auf dein Ritual." },
                    history: { title: "Vollständiger Verlauf", desc: "Alle vergangenen Lesungen und Trends anzeigen." },
                    analytics: { title: "Erweiterte Analysen", desc: "Verfolge deine spirituelle Reise mit Diagrammen." },
                    notes: { title: "Persönliche Notizen", desc: "Dokumentiere deine Gedanken zu jeder Karte." }
                },
                pricing: {
                    badge: "Bester Wert",
                    lifetime: "Lebenslanger Zugang"
                },
                cta: "Für immer freischalten",
                links: {
                    privacy: "Datenschutz",
                    terms: "Bedingungen"
                }
            },
            promo: {
                magicText: "Um mehr Lesungen zu verschiedenen Themen zu erhalten, schauen Sie sich unsere App an ",
                magicLink: "Tarot Cards Magic",
                healingText: "Konzentrieren Sie sich auf tägliche Aufgaben mit ",
                healingLink: "Healing sounds App",
                astrologyText: "Wie beeinflussen die Sterne heute deine Liebe? Schau dir ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Tageslesung",
                upright: "Aufrecht • Reflexion",
                reflection: "Reflexion",
                reflectionQuestion: "Was versucht Ihnen diese Karte heute zu sagen?",
                reflectionPrompt: "Nehmen Sie sich einen Moment Zeit, um sich mit dem Bild zu verbinden. Wie resoniert die Energie von {{cardName}} mit Ihrer aktuellen Situation?",
                placeholder: "Beginnen Sie hier, Ihre Gedanken zu schreiben...",
                saveEntry: "Eintrag speichern"
            }
        }
    },
    ja: {
        translation: {
            tabs: {
                home: "ホーム",
                deck: "デッキ",
                notes: "メモ",
                settings: "設定",
                analytics: "分析"
            },
            settings: {
                title: "設定",
                preferences: "環境設定",
                language: "言語",
                notifications: "通知",
                widget: "ウィジェット",
                configure: "設定する",
                appearance: "外観",
                textSize: "文字サイズ",
                theme: "テーマ",
                about: "アプリについて",
                privacy: "プライバシーポリシー",
                selectTheme: "テーマを選択",
                selectLanguage: "言語を選択",
                share: "アプリをシェア",
                shareMessage: "今日のタロットをチェック！ 🔮",
                appInfo: "アプリ情報",
                appDescription: "今日のタロットは、日々のスピリチュアルなガイダンスのためのデジタルコンパニオンです。毎日カードを引き、その意味を振り返りましょう。",
                version: "バージョン",
                contactUs: "お問い合わせ",
                history: "私の旅",
                historySubtitle: "あなたの道を振り返る",
                endOfHistory: "履歴の終わり",
                unlockPremium: "プレミアムを解除",
                premiumDesc: "広告なし＆履歴無制限",
                saved: "設定を保存しました。",
                dataManagement: "データ管理",
                backup: "データをバックアップ",
                restore: "データを復元",
                backupShareTitle: "バックアップファイルを保存",
                sharingNotAvailable: "このデバイスでは共有できません",
                backupError: "バックアップの作成に失敗しました",
                invalidBackupFile: "無効なバックアップファイル",
                restoreSuccess: "復元完了: ノート{{notes}}件、履歴{{history}}件！",
                restoreError: "復元に失敗しました",
                backupHelp: {
                    title: "バックアップガイド",
                    intro: "手動ファイルエクスポートでデータを移行できます。",
                    exportTitle: "エクスポート（旧端末）",
                    exportStep1: "設定 > データをバックアップ",
                    exportStep2: "ファイルをクラウド/ファイルに保存",
                    exportStep3: "新しい端末に送信",
                    exportStep4: ".jsonで終わることを確認",
                    importTitle: "インポート（新端末）",
                    importStep1: "この端末に.jsonファイルを用意",
                    importStep2: "設定 > データを復元",
                    importStep3: "ファイルを選択"
                }
            },
            common: {
                success: "成功",
                error: "エラー",
                saving: "保存中...",
                errorSave: "設定の保存に失敗しました。",
                cancel: "キャンセル",
                ok: "OK",
                optimizing: "体験を最適化中...",
                chooseLanguage: "好みの言語を選択してください"
            },
            widget: {
                title: "ウィジェット設定",
                preview: "プレビュー",
                howToAdd: "追加方法",
                troubleshooting: "トラブルシューティング",
                forceUpdate: "更新を強制",
                forceUpdateDesc: "正しく表示されない場合はここをタップ。",
                step1: "ホーム画面へ移動。",
                step2: "空きスペースを長押し。",
                step3: "'ウィジェット'を選択。",
                step4: "'Daily Tarot'を探す。",
                step5: "ウィジェットをドラッグ。",
                step6: "アプリを開いて同期してください。",
                alertNoCard: "カードなし",
                alertNoCardDesc: "まだ今日のカードを引いていません！",
                alertSuccess: "成功",
                alertSuccessDesc: "更新をリクエストしました！",
                alertError: "エラー",
                alertErrorDesc: "同期に失敗しました。",
                light: "ライト",
                dark: "ダーク",
                transparency: "透明度",
                showDate: "日付を表示",
                showDateDesc: "現在の日付を表示"
            },
            analytics: {
                title: "魂の分析",
                majorMinor: "大アルカナ vs 小アルカナ",
                major: "大",
                minor: "小",
                focusMajor: "あなたは大きな人生の教訓に焦点を当てています。",
                focusMinor: "あなたは日々の事柄に焦点を当てています。",
                elemental: "エレメントのバランス",
                fire: "火",
                water: "水",
                air: "風",
                earth: "土",
                mostFrequent: "最も頻繁なカード",
                drawnTimes: "{{count}}回引きました",
                noData: "データなし",
                noDataDesc: "最初のカードを引いて旅を始めましょう。",
                lockDescription: "包括的なタロット分析を解除し、スピリチュアルな旅の深いパターンを発見しましょう。",
                streak: "現在のストリーク",
                days: "日",
                activity: "週間アクティビティ",
                numerology: "数秘術",
                aces: "エース",
                numbers: "数字 (2-10)",
                court: "コートカード"
            },
            notifications: {
                dailyTitle: "デイリータロットが待っています 🔮",
                dailyBody: "今日のカードが持つ知恵を発見しましょう。"
            },
            main: {
                title: "今日のタロットカード",
                tapToReveal: "タップしてめくる",
                yourCard: "今日のカード",
                readMeaning: "意味を読む",
                noCardDrawn: "この日のカードは引かれていません。",
                askOracle: "オラクルに聞く"
            },
            chat: {
                title: "タロットコーチAI",
                init: "今日は{{cardName}}を引きましたね。どのような導きを求めていますか？",
                typing: "オラクルが思考中...",
                placeholder: "何でも聞いてください...",
                fallback: "カード",
                responses: [
                    "{{cardName}}について考えると、バランスの必要性が示唆されます。",
                    "それは深い質問です。カードは隠された機会を示しています。",
                    "{{cardName}}に関しては、直感を信じてください。",
                    "ここのエネルギーは強力です。明確に進んでください。"
                ],
                suggestions: {
                    general: "今日の主なテーマは？",
                    love: "恋愛にどう影響しますか？",
                    career: "仕事については？",
                    action: "どうすればいいですか？"
                },
                copy: "コピー",
                share: "共有",
                saveNote: "メモに保存",
                tip: "ヒント：メッセージを長押しして保存または共有",
                errorFallback: "オラクルは瞑想中です。もう一度お試しください。"
            },
            appearance: {
                title: "外観",
                theme: "アプリのテーマ",
                themeSystem: "システム設定に従う",
                themeLight: "ライト",
                themeDark: "ダーク",
                textSize: "文字サイズ",
                textSmall: "小",
                textMedium: "中（標準）",
                textLarge: "大",
            },
            tags: {
                intuition: "直感",
                mystery: "神秘",
            },
            date: {
                today: "今日",
                yesterday: "昨日"
            },
            card: {
                dailyWisdom: "今日の教訓",
                saveToJournal: "ジャーナルに保存",
                general: "概要",
                love: "愛と人間関係",
                career: "仕事とキャリア",
                finance: "お金と財政",
                health: "健康",
                spirituality: "スピリチュアリティ",
                advice: "アドバイス",
                personal: "個人の状態",
                deep: "深い意味",
                yes_no: "はい / いいえ",
                astrology: "占星術",
                claim: "アファメーション",
                person: "人物像",
                how_to_read: "読み方",
                reversed: "逆位置の意味",
                keywords: "キーワード",
                notes: "マイノート",
                numberOfNotes: "メモの数: "
            },
            themes: {
                dark: "夕暮れ (ダーク)",
                light: "夜明け (ライト)",
                ethereal: "幽玄の庭"
            },
            languages: {
                en: "英語",
                ru: "ロシア語",
                es: "スペイン語",
                pt: "ポルトガル語",
                it: "イタリア語",
                fr: "フランス語",
                de: "ドイツ語",
                ja: "日本語",
                pl: "ポーランド語"
            },
            notes: {
                addNote: "メモを追加",
                myNotes: "マイノート",
                noNotes: "メモはまだありません。書き始めましょう...",
                save: "保存",
                delete: "削除",
                edit: "編集"
            },
            rate: {
                title: "評価をお願いします",
                message: "アプリを楽しんでいただけていますか？よろしければ評価をお願いします。ご協力ありがとうございます！",
                yes: "今すぐ評価",
                later: "後で通知",
                no: "いいえ"
            },
            paywall: {
                title: "プレミアムアクセス",
                restore: "復元",
                hero: {
                    title_lines: "あなたのつながりを\n深める",
                    subtitle: "一度の購入で、毎日のリーディングの可能性を最大限に引き出します。"
                },
                features: {
                    oracle: { title: "オラクルに聞く", desc: "AIによる回答でより深い洞察を得る。" },
                    ads: { title: "広告なしの聖域", desc: "気が散ることなく儀式に集中できます。" },
                    history: { title: "完全な履歴アクセス", desc: "過去のすべてのリーディングと傾向を表示。" },
                    analytics: { title: "高度な分析", desc: "チャートでスピリチュアルな旅を追跡。" },
                    notes: { title: "個人的なメモ", desc: "カードごとに思考を記録。" }
                },
                pricing: {
                    badge: "ベストバリュー",
                    lifetime: "生涯アクセス"
                },
                cta: "永久にロック解除",
                links: {
                    privacy: "プライバシー",
                    terms: "利用規約"
                }
            },
            promo: {
                magicText: "さまざまなテーマに関するリーディングをもっと見るには、アプリをチェックしてください ",
                magicLink: "Tarot Cards Magic",
                healingText: "毎日のタスクに集中するには ",
                healingLink: "Healing sounds App",
                astrologyText: "今日は星があなたの愛にどう影響していますか？チェックしてください ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "デイリーリーディング",
                upright: "正位置 • 内省",
                reflection: "内省",
                reflectionQuestion: "今日、このカードは何を伝えようとしていますか？",
                reflectionPrompt: "少し時間を取って、イメージとつながってみてください。{{cardName}}のエネルギーは、あなたの現在の状況とどのように共鳴しますか？",
                placeholder: "ここにあなたの考えを書き始めてください...",
                saveEntry: "エントリを保存"
            }
        }
    },
    pl: {
        translation: {
            tabs: {
                home: "Główna",
                deck: "Talia",
                notes: "Notatki",
                settings: "Ustawienia",
                analytics: "Analityka"
            },
            settings: {
                title: "Ustawienia",
                preferences: "Preferencje",
                language: "Język",
                notifications: "Powiadomienia",
                widget: "Widżet",
                configure: "Konfiguruj",
                appearance: "Wygląd",
                textSize: "Rozmiar tekstu",
                theme: "Motyw",
                about: "O aplikacji",
                privacy: "Polityka prywatności",
                selectTheme: "Wybierz motyw",
                selectLanguage: "Wybierz język",
                share: "Udostępnij aplikację",
                shareMessage: "Sprawdź Tarot na Dzień! 🔮",
                appInfo: "Info o aplikacji",
                appDescription: "Tarot na Dzień to Twój cyfrowy towarzysz codziennego przewodnictwa duchowego. Losuj codzienną kartę i, rozważaj jej znaczenie.",
                version: "Wersja",
                contactUs: "Kontakt",
                history: "Moja Podróż",
                historySubtitle: "Zastanów się nad swoją ścieżką",
                endOfHistory: "Koniec historii",
                unlockPremium: "Odblokuj Premium",
                premiumDesc: "Usuń reklamy i nielimitowana historia",
                saved: "Ustawienia zapisane pomyślnie.",
                dataManagement: "Zarządzanie Danymi",
                backup: "Kopia Zapasowa",
                restore: "Przywróć Dane",
                backupShareTitle: "Zapisz Plik Kopii",
                sharingNotAvailable: "Udostępnianie niedostępne",
                backupError: "Błąd tworzenia kopii",
                invalidBackupFile: "Nieprawidłowy plik",
                restoreSuccess: "Przywrócono: {{notes}} notatek, {{history}} historii!",
                restoreError: "Nie udało się przywrócić",
                backupHelp: {
                    title: "Przewodnik Kopii",
                    intro: "Przenieś dane za pomocą eksportu pliku.",
                    exportTitle: "Eksport (Stare)",
                    exportStep1: "Ustawienia > Kopia Zapasowa",
                    exportStep2: "Zapisz plik w chmurze",
                    exportStep3: "Wyślij na nowe urządzenie",
                    exportStep4: "Upewnij się, że to .json",
                    importTitle: "Import (Nowe)",
                    importStep1: "Miej plik .json gotowy",
                    importStep2: "Ustawienia > Przywróć Dane",
                    importStep3: "Wybierz plik"
                }
            },
            common: {
                success: "Sukces",
                error: "Błąd",
                saving: "Zapisywanie...",
                errorSave: "Nie udało się zapisać ustawień.",
                cancel: "Anuluj",
                ok: "OK",
                optimizing: "Optymalizacja twojego doświadczenia...",
                chooseLanguage: "Proszę wybrać preferowany język"
            },
            widget: {
                title: "Konfiguracja Widżetu",
                preview: "PODGLĄD",
                howToAdd: "Jak dodać",
                troubleshooting: "Rozwiązywanie problemów",
                forceUpdate: "Wymuś aktualizację widżetu",
                forceUpdateDesc: "Dotknij tutaj, jeśli widżet nie pokazuje właściwej karty.",
                step1: "Idź do Ekranu Głównego.",
                step2: "Przytrzymaj puste miejsce.",
                step3: "Wybierz 'Widżety'.",
                step4: "Przewiń, aby znaleźć 'Daily Tarot'.",
                step5: "Przeciągnij widżet na ekran.",
                step6: "Otwórz aplikację, aby zsynchronizować.",
                alertNoCard: "Brak karty",
                alertNoCardDesc: "Nie wylosowałeś jeszcze karty na dzisiaj!",
                alertSuccess: "Sukces",
                alertSuccessDesc: "Zażądano aktualizacji widżetu!",
                alertError: "Błąd",
                alertErrorDesc: "Błąd synchronizacji widżetu.",
                light: "Jasny",
                dark: "Ciemny",
                transparency: "Przezroczystość",
                showDate: "Pokaż datę",
                showDateDesc: "Wyświetl bieżącą datę na widżecie"
            },
            analytics: {
                title: "Analityka Duszy",
                majorMinor: "Arkana Wielkie vs Małe",
                major: "Wielkie",
                minor: "Małe",
                focusMajor: "Skupiasz się na ważnych lekcjach życiowych.",
                focusMinor: "Skupiasz się na sprawach codziennych.",
                elemental: "Równowaga Żywiołów",
                fire: "Ogień",
                water: "Woda",
                air: "Powietrze",
                earth: "Ziemia",
                mostFrequent: "Najczęstsza Karta",
                drawnTimes: "Wylosowana {{count}} razy",
                noData: "Brak danych",
                noDataDesc: "Rozpocznij podróż, losując pierwszą kartę.",
                lockDescription: "Odblokuj pełną analitykę Tarota i odkryj głębsze wzorce w swojej duchowej podróży.",
                streak: "Obecna Seria",
                days: "Dni",
                activity: "Aktywność Tygodniowa",
                numerology: "Numerologia",
                aces: "Asy",
                numbers: "Liczby (2-10)",
                court: "Karty Dworskie"
            },
            notifications: {
                dailyTitle: "Twój Codzienny Tarot Czeka 🔮",
                dailyBody: "Odkryj mądrość, jaką karty mają dla Ciebie dzisiaj."
            },
            main: {
                title: "Karta Tarota Dnia",
                tapToReveal: "Dotknij, aby odkryć",
                yourCard: "Twoja karta na dziś",
                readMeaning: "Czytaj znaczenie",
                noCardDrawn: "Nie wylosowano karty na ten dzień.",
                askOracle: "Zapytaj Wyrocznię"
            },
            chat: {
                title: "Trener Tarota AI",
                init: "Widzę, że wylosowałeś {{cardName}}. Jakiego przewodnictwa szukasz?",
                typing: "Wyrocznia myśli...",
                placeholder: "Zapytaj o cokolwiek...",
                fallback: "karty",
                responses: [
                    "Zastanawiając się nad {{cardName}}, sugeruje to potrzebę równowagi.",
                    "To głębokie pytanie. Karty wskazują na ukrytą szansę.",
                    "Z {{cardName}}, zaufaj swojej intuicji.",
                    "Energia tutaj jest potężna. Postępuj z jasnością."
                ],
                suggestions: {
                    general: "Jaki jest główny temat?",
                    love: "Jak to wpływa na miłość?",
                    career: "A co z karierą?",
                    action: "Co mam zrobić?"
                },
                copy: "Kopiuj",
                share: "Udostępnij",
                saveNote: "Zapisz w notatce",
                tip: "Wskazówka: Przytrzymaj wiadomość, aby zapisać lub udostępnić",
                errorFallback: "Wyrocznia medytuje. Spróbuj ponownie."
            },
            appearance: {
                title: "Wygląd",
                theme: "Motyw aplikacji",
                themeSystem: "Domyślny systemowy",
                themeLight: "Jasny",
                themeDark: "Ciemny",
                textSize: "Rozmiar tekstu",
                textSmall: "Mały",
                textMedium: "Średni (Domyślny)",
                textLarge: "Duży",
            },
            tags: {
                intuition: "Intuicja",
                mystery: "Tajemnica",
            },
            date: {
                today: "Dziś",
                yesterday: "Wczoraj"
            },
            card: {
                dailyWisdom: "Codzienna Mądrość",
                saveToJournal: "Zapisz w dzienniku",
                general: "Ogólny przegląd",
                love: "Miłość i relacje",
                career: "Kariera i praca",
                finance: "Pieniądze i finanse",
                health: "Zdrowie",
                spirituality: "Duchowość",
                advice: "Rada",
                personal: "Stan osobisty",
                deep: "Głębokie znaczenie",
                yes_no: "Tak / Nie",
                astrology: "Astrologia",
                claim: "Afirmacja",
                person: "Jako osoba",
                how_to_read: "Jak czytać",
                reversed: "Odwrócone znaczenie",
                keywords: "Słowa kluczowe",
                notes: "Moje Notatki",
                numberOfNotes: "Liczba notatek: "
            },
            themes: {
                dark: "Zmierzch (Ciemny)",
                light: "Świt (Jasny)",
                ethereal: "Eteryczny Ogród"
            },
            languages: {
                en: "Angielski",
                ru: "Rosyjski",
                es: "Hiszpański",
                pt: "Portugalski",
                it: "Włoski",
                fr: "Francuski",
                de: "Niemiecki",
                ja: "Japoński",
                pl: "Polski"
            },
            notes: {
                addNote: "Dodaj notatkę",
                myNotes: "Moje notatki",
                noNotes: "Brak notatek. Zacznij pisać...",
                save: "Zapisz",
                delete: "Usuń",
                edit: "Edytuj"
            },
            rate: {
                title: "Oceń nas",
                message: "Podoba Ci się aplikacja? Czy możesz poświęcić chwilę, aby ją ocenić? Dziękujemy za wsparcie!",
                yes: "Oceń teraz",
                later: "Przypomnij później",
                no: "Nie, dziękuję"
            },
            paywall: {
                title: "Dostęp Premium",
                restore: "Przywróć",
                hero: {
                    title_lines: "Pogłębiaj swoje\nPołączenie",
                    subtitle: "Odblokuj pełny potencjał swoich codziennych odczytów jednym zakupem."
                },
                features: {
                    oracle: { title: "Zapytaj Wyrocznię", desc: "Uzyskaj głębsze wglądy dzięki odpowiedziom AI." },
                    ads: { title: "Sanktuarium bez reklam", desc: "Skup się na swoim rytuale bez rozpraszaczy." },
                    history: { title: "Pełny dostęp do historii", desc: "Zobacz wszystkie przeszłe odczyty i trendy." },
                    analytics: { title: "Zaawansowana analityka", desc: "Śledź swoją duchową podróż za pomocą wykresów." },
                    notes: { title: "Osobiste notatki", desc: "Zapisuj swoje myśli przy każdej karcie." }
                },
                pricing: {
                    badge: "Najlepsza wartość",
                    lifetime: "Dostęp dożywotni"
                },
                cta: "Odblokuj na zawsze",
                links: {
                    privacy: "Prywatność",
                    terms: "Warunki"
                }
            },
            promo: {
                magicText: "Aby uzyskać więcej odczytów na różne tematy, sprawdź naszą aplikację ",
                magicLink: "Tarot Cards Magic",
                healingText: "Skup się na codziennych zadaniach z ",
                healingLink: "Healing sounds App",
                astrologyText: "Jak gwiazdy wpływają dziś na Twoją miłość? Sprawdź ",
                astrologyLink: "Astrology Transits AI"
            },
            journal: {
                dailyReading: "Codzienne Czytanie",
                upright: "Pozycja Prosta • Refleksja",
                reflection: "Refleksja",
                reflectionQuestion: "Co ta karta próbuje ci dzisiaj powiedzieć?",
                reflectionPrompt: "Poświęć chwilę na połączenie się z obrazem. Jak energia {{cardName}} rezonuje z twoją obecną sytuacją?",
                placeholder: "Zacznij pisać swoje myśli tutaj...",
                saveEntry: "Zapisz Wpis"
            }
        }
    }
};
