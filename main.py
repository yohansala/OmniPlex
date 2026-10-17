from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.label import Label


class CalculadoraApp(App):

  def build(self):
    layout_principal = BoxLayout(orientation="vertical", padding=10, spacing=10)

    self.pantalla = Label(
        text="0",
        font_size=40,
        size_hint=(1, 0.2),
    )
    layout_principal.add_widget(self.pantalla)

    layout_botones = GridLayout(cols=4, spacing=5, size_hint=(1, 0.8))

    botones = [
        "C", "Borrar", "(", ")",
        "7", "8", "9", "÷",
        "4", "5", "6", "×",
        "1", "2", "3", "-",
        ".", "0", "=", "+"
    ]

    for texto in botones:
      btn = Button(text=texto, font_size=24)
      btn.bind(on_press=self.al_presionar_boton)
      layout_botones.add_widget(btn)

    layout_principal.add_widget(layout_botones)

    return layout_principal

  def al_presionar_boton(self, instance):
    texto = instance.text
    texto_actual = self.pantalla.text

    if texto == "C":
      self.pantalla.text = "0"

    elif texto == "Borrar":
      if len(texto_actual) > 1:
        self.pantalla.text = texto_actual[:-1]
      else:
        self.pantalla.text = "0"

    elif texto == "=":
      try:
        expresion = texto_actual.replace("÷", "/").replace("×", "*")
        resultado = str(eval(expresion))
        self.pantalla.text = resultado
      except:
        self.pantalla.text = "Error"

    else:
      if texto_actual == "0":
        self.pantalla.text = texto
      else:
        self.pantalla.text += texto


if __name__ == "__main__":
  CalculadoraApp().run()
