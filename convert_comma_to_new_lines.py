# Programa para convertir una lista de palabras divididas por coma a una lista de palabras divididas por \\n

input = input('Ingrese una lista de palabras dividida por comas:')
splitted = input.split(", ")
output = ""
for word in splitted:
    if output == "":
        output = word
    else:
        output = output + "\\n" + word

print(">>>RESULTADO: ")
print(output)
print("-------------------------------------------------")